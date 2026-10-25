import {
  useEffect,
  useRef,
  useState,
} from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker

function ApprovalSignPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const canvasRefs =
    useRef({})

  const pageRefs =
    useRef({})

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Văn D",
  ]

  const defaultApprovals = [
    {
      id: "TK-0001",
      name:
        "Đề nghị mua sắm thiết bị",
      creator:
        "Nguyễn Văn A",
      approver:
        "Trần Thị B",
      signer:
        "Lê Văn C",
      status:
        "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
      fileData: "",
      fileType:
        "application/pdf",
      signatureMethod:
        "VNPT Smart CA",
      signaturePosition: null,
    },
    {
      id: "TK-0002",
      name:
        "Quyết định điều động nhân sự",
      creator:
        "Trần Thị B",
      approver:
        "Lê Văn C",
      signer:
        "Phạm Văn D",
      status: "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
      fileData: "",
      fileType:
        "application/pdf",
      signatureMethod:
        "VNPT Smart CA",
      signaturePosition: null,
    },
  ]

  const savedApprovals =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovals"
      )
    ) || []

  const statusOverrides =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalStatus"
      )
    ) || {}

  const savedWorkflowStates =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalWorkflowStates"
      )
    ) || {}

  const savedDelegatesRaw =
    JSON.parse(
      localStorage.getItem(
        "hlcApprovalDelegates"
      )
    ) || {}

  const allApprovals = [
    ...defaultApprovals,
    ...savedApprovals,
  ]

  const approval =
    allApprovals.find(
      (item) =>
        item.id === id
    )

  const savedPrototypeUser =
    localStorage.getItem(
      "hlcPrototypeUser"
    ) || "Nguyễn Văn A"

  const [
    currentUser,
    setCurrentUser,
  ] = useState(
    savedPrototypeUser
  )

  const [
    pdfDocument,
    setPdfDocument,
  ] = useState(null)

  const [
    numPages,
    setNumPages,
  ] = useState(0)

  const [
    pdfLoading,
    setPdfLoading,
  ] = useState(false)

  const [
    pdfError,
    setPdfError,
  ] = useState("")

  const [
    signing,
    setSigning,
  ] = useState(false)

  const [error, setError] =
    useState("")

  if (!approval) {
    return (
      <div>
        <h1>
          Không tìm thấy hồ sơ
        </h1>

        <button
          onClick={() =>
            navigate("/approval")
          }
        >
          ← Quay lại
        </button>
      </div>
    )
  }

  // =========================
  // WORKFLOW
  // =========================

  const getWorkflow = () => {
    if (
      Array.isArray(
        approval.approvalFlow
      ) &&
      approval.approvalFlow.length >
        0
    ) {
      return approval.approvalFlow.map(
        (step, index) => ({
          ...step,

          step:
            step.step ||
            index + 1,

          flowType:
            step.flowType ||
            "Tuần tự",

          handlers:
            Array.isArray(
              step.handlers
            )
              ? step.handlers
              : [],
        })
      )
    }

    const legacy = []

    if (approval.approver) {
      legacy.push({
        id:
          "legacy-control",
        step: 1,
        flowType:
          "Tuần tự",

        handlers: [
          {
            id:
              "legacy-control-handler",
            user:
              approval.approver,
            actionType:
              "Kiểm soát",
            signatureMethod:
              "",
          },
        ],
      })
    }

    if (approval.signer) {
      legacy.push({
        id: "legacy-sign",
        step:
          legacy.length + 1,
        flowType:
          "Tuần tự",

        handlers: [
          {
            id:
              "legacy-sign-handler",
            user:
              approval.signer,
            actionType:
              "Ký duyệt",
            signatureMethod:
              approval.signatureMethod ||
              "",
          },
        ],
      })
    }

    return legacy
  }

  const workflow =
    getWorkflow()

  const flatHandlers =
    workflow.flatMap(
      (step) =>
        step.handlers
    )

  const sourceStatus =
    statusOverrides[id] ||
    approval.status ||
    ""

  const createInitialStates =
    () => {
      const states = {}

      flatHandlers.forEach(
        (handler) => {
          states[handler.id] = {
            status: "pending",
          }
        }
      )

      if (
        sourceStatus ===
          "Hoàn tất" ||
        sourceStatus ===
          "Hoàn thành"
      ) {
        flatHandlers.forEach(
          (handler) => {
            states[
              handler.id
            ] = {
              status:
                "completed",
            }
          }
        )

        return states
      }

      if (
        sourceStatus ===
          "Chờ ký" ||
        sourceStatus ===
          "Đang phê duyệt"
      ) {
        const signerIndex =
          flatHandlers.findIndex(
            (handler) =>
              handler.actionType ===
              "Ký duyệt"
          )

        if (
          signerIndex > 0
        ) {
          flatHandlers
            .slice(
              0,
              signerIndex
            )
            .forEach(
              (handler) => {
                states[
                  handler.id
                ] = {
                  status:
                    "completed",
                }
              }
            )
        }
      }

      return states
    }

  const storedState =
    savedWorkflowStates[id]
      ?.handlerStates ||
    createInitialStates()

  const [
    handlerStates,
    setHandlerStates,
  ] = useState(
    storedState
  )

  const normalizeDelegates =
    () => {
      const raw =
        savedDelegatesRaw[id]

      if (!raw) {
        return {}
      }

      if (
        typeof raw ===
        "object"
      ) {
        return raw
      }

      const firstSigner =
        flatHandlers.find(
          (handler) =>
            handler.actionType ===
            "Ký duyệt"
        )

      if (!firstSigner) {
        return {}
      }

      return {
        [firstSigner.id]:
          raw,
      }
    }

  const delegates =
    normalizeDelegates()

  const isCompleted = (
    handler,
    states = handlerStates
  ) =>
    states[
      handler.id
    ]?.status ===
    "completed"

  const getCurrentStepIndex = (
    states = handlerStates
  ) =>
    workflow.findIndex(
      (step) =>
        !step.handlers.every(
          (handler) =>
            isCompleted(
              handler,
              states
            )
        )
    )

  const getActiveHandlers = (
    states = handlerStates
  ) => {
    const index =
      getCurrentStepIndex(
        states
      )

    if (index < 0) {
      return []
    }

    const step =
      workflow[index]

    const pending =
      step.handlers.filter(
        (handler) =>
          !isCompleted(
            handler,
            states
          )
      )

    if (
      step.flowType ===
      "Song song"
    ) {
      return pending
    }

    return pending.slice(0, 1)
  }

  const getEffectiveUser = (
    handler
  ) =>
    delegates[
      handler.id
    ] ||
    handler.user

  const activeHandlers =
    getActiveHandlers()

  const activeSigningHandler =
    activeHandlers.find(
      (handler) =>
        handler.actionType ===
          "Ký duyệt" &&
        getEffectiveUser(
          handler
        ) === currentUser
    )

  const deriveStatus = (
    states
  ) => {
    const active =
      getActiveHandlers(
        states
      )

    if (
      active.length === 0
    ) {
      return "Hoàn thành"
    }

    const types = [
      ...new Set(
        active.map(
          (handler) =>
            handler.actionType
        )
      ),
    ]

    if (
      types.length !== 1
    ) {
      return "Đang xử lý"
    }

    if (
      types[0] ===
      "Kiểm soát"
    ) {
      return "Đang kiểm soát"
    }

    if (
      types[0] ===
      "Tham mưu"
    ) {
      return "Đang tham mưu"
    }

    if (
      types[0] ===
      "Ký duyệt"
    ) {
      return "Đang phê duyệt"
    }

    return "Đang xử lý"
  }

  const signatureMethod =
    activeSigningHandler
      ?.signatureMethod ||
    approval.signatureMethod ||
    ""

  // Hiện prototype vẫn dùng một
  // vùng ký chung của hồ sơ.
  // Bước tiếp theo mới tách vùng
  // ký riêng cho từng người ký.
  const signaturePage =
    approval.signaturePosition
      ?.page || null

  const signatureX =
    approval.signaturePosition
      ?.x ?? null

  const signatureY =
    approval.signaturePosition
      ?.y ?? null

  const fileData =
    approval.fileData || ""

  const fileType =
    approval.fileType || ""

  // =========================
  // PDF
  // =========================

  const dataUrlToUint8Array = (
    dataUrl
  ) => {
    const base64 =
      dataUrl.split(",")[1]

    const binaryString =
      window.atob(base64)

    const bytes =
      new Uint8Array(
        binaryString.length
      )

    for (
      let i = 0;
      i <
      binaryString.length;
      i += 1
    ) {
      bytes[i] =
        binaryString.charCodeAt(
          i
        )
    }

    return bytes
  }

  useEffect(() => {
    if (
      !fileData ||
      fileType !==
        "application/pdf"
    ) {
      setPdfDocument(null)
      setNumPages(0)
      setPdfLoading(false)
      setPdfError("")
      return
    }

    let cancelled = false
    let loadedPdf = null

    const loadPdf =
      async () => {
        try {
          setPdfLoading(true)
          setPdfError("")

          const data =
            dataUrlToUint8Array(
              fileData
            )

          const loadingTask =
            pdfjsLib.getDocument({
              data,
            })

          const pdf =
            await loadingTask.promise

          if (cancelled) {
            await pdf.destroy()
            return
          }

          loadedPdf = pdf

          setPdfDocument(pdf)
          setNumPages(
            pdf.numPages
          )
        } catch (err) {
          console.error(err)

          if (!cancelled) {
            setPdfDocument(null)
            setNumPages(0)

            setPdfError(
              "Không thể hiển thị file PDF."
            )
          }
        } finally {
          if (!cancelled) {
            setPdfLoading(
              false
            )
          }
        }
      }

    loadPdf()

    return () => {
      cancelled = true

      if (loadedPdf) {
        loadedPdf.destroy()
      }
    }
  }, [
    fileData,
    fileType,
  ])

  useEffect(() => {
    if (
      !pdfDocument ||
      numPages === 0
    ) {
      return
    }

    let cancelled = false

    const renderPages =
      async () => {
        for (
          let pageNumber = 1;
          pageNumber <=
          numPages;
          pageNumber += 1
        ) {
          if (cancelled) {
            return
          }

          const canvas =
            canvasRefs.current[
              pageNumber
            ]

          if (!canvas) {
            continue
          }

          try {
            const page =
              await pdfDocument.getPage(
                pageNumber
              )

            const baseViewport =
              page.getViewport({
                scale: 1,
              })

            const targetWidth =
              760

            const scale =
              targetWidth /
              baseViewport.width

            const viewport =
              page.getViewport({
                scale,
              })

            const outputScale =
              window.devicePixelRatio ||
              1

            const context =
              canvas.getContext(
                "2d"
              )

            canvas.width =
              Math.floor(
                viewport.width *
                  outputScale
              )

            canvas.height =
              Math.floor(
                viewport.height *
                  outputScale
              )

            canvas.style.width =
              "100%"

            canvas.style.height =
              "auto"

            const transform =
              outputScale !== 1
                ? [
                    outputScale,
                    0,
                    0,
                    outputScale,
                    0,
                    0,
                  ]
                : null

            await page
              .render({
                canvasContext:
                  context,
                viewport,
                transform,
              })
              .promise
          } catch (err) {
            if (!cancelled) {
              console.error(
                err
              )
            }
          }
        }
      }

    renderPages()

    return () => {
      cancelled = true
    }
  }, [
    pdfDocument,
    numPages,
  ])

  // =========================
  // USER
  // =========================

  const handleChangePrototypeUser = (
    event
  ) => {
    const user =
      event.target.value

    setCurrentUser(user)

    localStorage.setItem(
      "hlcPrototypeUser",
      user
    )

    setError("")
  }

  // =========================
  // SIGN
  // =========================

  const handleSign = () => {
    if (
      !activeSigningHandler
    ) {
      setError(
        "Hiện chưa có bước ký nào đang chờ người dùng này."
      )
      return
    }

    if (!signatureMethod) {
      setError(
        "Người ký chưa được thiết lập phương thức ký."
      )
      return
    }

    if (!signaturePage) {
      setError(
        "Hồ sơ chưa được thiết lập vị trí ký."
      )
      return
    }

    const confirmed =
      window.confirm(
        `Xác nhận ký bằng ${signatureMethod} tại trang ${signaturePage}?`
      )

    if (!confirmed) {
      return
    }

    setSigning(true)
    setError("")

    try {
      const nextStates = {
        ...handlerStates,

        [activeSigningHandler.id]:
          {
            status:
              "completed",

            actionBy:
              currentUser,

            actionAt:
              new Date().toLocaleString(
                "vi-VN"
              ),
          },
      }

      const currentWorkflowStates =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalWorkflowStates"
          )
        ) || {}

      currentWorkflowStates[id] =
        {
          handlerStates:
            nextStates,

          updatedAt:
            new Date().toLocaleString(
              "vi-VN"
            ),
        }

      localStorage.setItem(
        "hlcApprovalWorkflowStates",
        JSON.stringify(
          currentWorkflowStates
        )
      )

      setHandlerStates(
        nextStates
      )

      const nextStatus =
        deriveStatus(
          nextStates
        )

      const currentStatuses =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalStatus"
          )
        ) || {}

      currentStatuses[id] =
        nextStatus

      localStorage.setItem(
        "hlcApprovalStatus",
        JSON.stringify(
          currentStatuses
        )
      )

      const allSignatures =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalSignatures"
          )
        ) || {}

      const existing =
        allSignatures[id]

      const signatureList =
        Array.isArray(existing)
          ? existing
          : existing
            ? [existing]
            : []

      signatureList.push({
        handlerId:
          activeSigningHandler.id,

        originalSigner:
          activeSigningHandler.user,

        signer:
          currentUser,

        method:
          signatureMethod,

        page:
          signaturePage,

        x:
          signatureX,

        y:
          signatureY,

        delegated:
          currentUser !==
          activeSigningHandler.user,

        signedAt:
          new Date().toLocaleString(
            "vi-VN"
          ),
      })

      allSignatures[id] =
        signatureList

      localStorage.setItem(
        "hlcApprovalSignatures",
        JSON.stringify(
          allSignatures
        )
      )

      const savedComments =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalComments"
          )
        ) || {}

      const oldComments =
        savedComments[id] || []

      savedComments[id] = [
        ...oldComments,
        {
          author:
            currentUser,

          content:
            `Đã ký duyệt bằng ${signatureMethod} tại trang ${signaturePage}.`,

          date:
            new Date().toLocaleString(
              "vi-VN"
            ),
        },
      ]

      localStorage.setItem(
        "hlcApprovalComments",
        JSON.stringify(
          savedComments
        )
      )

      window.location.assign(
        `/approval/${id}`
      )
    } catch (err) {
      console.error(err)

      setError(
        "Không thể hoàn tất thao tác ký."
      )

      setSigning(false)
    }
  }

  const renderSignatureBox = (
    pageNumber
  ) => {
    if (
      pageNumber !==
      signaturePage
    ) {
      return null
    }

    return (
      <div
        style={{
          position:
            "absolute",

          left: `${
            signatureX ?? 50
          }%`,

          top: `${
            signatureY ?? 50
          }%`,

          transform:
            "translate(-50%, -50%)",

          width: "160px",

          minHeight:
            "75px",

          padding: "8px",

          border:
            "2px dashed #2563eb",

          borderRadius:
            "8px",

          background:
            "rgba(219, 234, 254, 0.94)",

          color:
            "#1d4ed8",

          display: "flex",

          flexDirection:
            "column",

          justifyContent:
            "center",

          alignItems:
            "center",

          textAlign:
            "center",

          fontWeight:
            "700",

          zIndex: 10,
        }}
      >
        <span>
          ✍️ Vùng ký
        </span>

        <small>
          {activeSigningHandler
            ? getEffectiveUser(
                activeSigningHandler
              )
            : "Chưa đến lượt ký"}
        </small>

        <small>
          {signatureMethod}
        </small>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/approval/${id}`
          )
        }
      >
        ← Quay lại chi tiết
      </button>

      <div className="detail-header">
        <h1>
          Ký duyệt tài liệu
        </h1>

        <p>
          {approval.name}
        </p>
      </div>

      <div className="detail-card">
        <h2>
          Người dùng mô phỏng
        </h2>

        <div className="form-group">
          <label>
            Người đang thao tác
          </label>

          <select
            value={
              currentUser
            }
            onChange={
              handleChangePrototypeUser
            }
          >
            {prototypeUsers.map(
              (user) => (
                <option
                  key={user}
                  value={user}
                >
                  {user}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {!activeSigningHandler && (
        <div className="settings-note">
          Người dùng hiện tại không có
          bước{" "}
          <strong>
            Ký duyệt
          </strong>{" "}
          đang hoạt động. Hãy quay lại
          Chi tiết trình ký để kiểm tra
          người đang đến lượt.
        </div>
      )}

      {activeSigningHandler && (
        <div className="detail-card">
          <h2>
            Thông tin ký
          </h2>

          <div className="detail-grid">
            <div>
              <span className="detail-label">
                Người phê duyệt
              </span>

              <p>
                <strong>
                  {
                    activeSigningHandler.user
                  }
                </strong>
              </p>
            </div>

            <div>
              <span className="detail-label">
                Người thực hiện ký
              </span>

              <p>
                <strong>
                  {getEffectiveUser(
                    activeSigningHandler
                  )}
                </strong>
              </p>
            </div>

            <div>
              <span className="detail-label">
                Phương thức ký
              </span>

              <p>
                {signatureMethod ||
                  "Chưa thiết lập"}
              </p>
            </div>

            <div>
              <span className="detail-label">
                Vị trí ký
              </span>

              <p>
                {signaturePage
                  ? `Trang ${signaturePage}`
                  : "Chưa thiết lập"}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="detail-card">
        <h2>
          Xem tài liệu
        </h2>

        {pdfLoading && (
          <p>
            Đang tải PDF...
          </p>
        )}

        {pdfError && (
          <div className="form-error">
            {pdfError}
          </div>
        )}

        {!fileData && (
          <div className="settings-note">
            Hồ sơ mẫu chưa có dữ liệu
            file để hiển thị. Hãy tạo
            một trình ký mới có PDF để
            test vùng ký.
          </div>
        )}

        {fileData &&
          fileType !==
            "application/pdf" && (
            <div className="settings-note">
              File hiện tại không phải
              PDF nên prototype chưa
              hiển thị trực tiếp.
            </div>
          )}

        {pdfDocument &&
          Array.from(
            {
              length:
                numPages,
            },
            (_, index) =>
              index + 1
          ).map(
            (pageNumber) => (
              <div
                key={
                  pageNumber
                }
                ref={(element) => {
                  pageRefs.current[
                    pageNumber
                  ] = element
                }}
                style={{
                  position:
                    "relative",

                  maxWidth:
                    "760px",

                  margin:
                    "0 auto 20px",

                  border:
                    "1px solid #d1d5db",

                  boxShadow:
                    "0 3px 10px rgba(0,0,0,0.08)",
                }}
              >
                <canvas
                  ref={(
                    canvas
                  ) => {
                    canvasRefs.current[
                      pageNumber
                    ] =
                      canvas
                  }}
                />

                {renderSignatureBox(
                  pageNumber
                )}

                <div
                  style={{
                    textAlign:
                      "center",

                    padding:
                      "6px",

                    background:
                      "#f9fafb",

                    fontSize:
                      "12px",
                  }}
                >
                  Trang{" "}
                  {pageNumber}
                </div>
              </div>
            )
          )}
      </div>

      <div className="form-actions">
        <button
          className="secondary-button"
          onClick={() =>
            navigate(
              `/approval/${id}`
            )
          }
        >
          Hủy
        </button>

        <button
          className="primary-button"
          disabled={
            !activeSigningHandler ||
            signing
          }
          onClick={
            handleSign
          }
        >
          {signing
            ? "Đang ký..."
            : "Xác nhận ký duyệt"}
        </button>
      </div>

      <div className="settings-note">
        Đây vẫn là mô phỏng ký số trên
        frontend. Chưa có giao dịch ký
        mật mã thật với VNPT SmartCA
        hoặc USB Token.
      </div>
    </div>
  )
}

export default ApprovalSignPage