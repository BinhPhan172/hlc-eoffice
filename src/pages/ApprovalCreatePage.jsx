import {
  useEffect,
  useRef,
  useState,
} from "react"

import { useNavigate } from "react-router-dom"

import * as pdfjsLib from "pdfjs-dist"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url"

pdfjsLib.GlobalWorkerOptions.workerSrc =
  pdfWorker

function ApprovalCreatePage() {
  const navigate = useNavigate()

  const canvasRefs = useRef({})
  const pageRefs = useRef({})

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Văn D",
  ]

  const defaultCategories = [
    {
      id: "DOC-CAT-001",
      name: "Quy chế",
    },
    {
      id: "DOC-CAT-002",
      name: "Hướng dẫn",
    },
    {
      id: "DOC-CAT-003",
      name: "Biên bản",
    },
    {
      id: "DOC-CAT-004",
      name: "Khác",
    },
  ]

  const savedCategories =
    JSON.parse(
      localStorage.getItem(
        "hlcDocumentCategories"
      )
    )

  const documentCategories =
    savedCategories !== null
      ? savedCategories
      : defaultCategories

  const priorityOptions = [
    "Bình thường",
    "Cao",
    "Khẩn",
  ]

  const flowTypeOptions = [
    "Tuần tự",
    "Song song",
  ]

  const actionTypeOptions = [
    "Kiểm soát",
    "Tham mưu",
    "Ký duyệt",
  ]

  const signatureMethodOptions = [
    "Nội bộ",
    "VNPT Smart CA",
    "USB Token",
  ]

  const createId = (
    prefix
  ) =>
    `${prefix}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`

  const createHandler = () => ({
    id: createId("handler"),
    user: "",
    actionType:
      "Kiểm soát",
    signatureMethod: "",
  })

  const createStep = () => ({
    id: createId("step"),
    name: "",
    flowType:
      "Tuần tự",
    handlers: [
      createHandler(),
    ],
  })

  const [name, setName] =
    useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [
    documentType,
    setDocumentType,
  ] = useState("")

  const [
    priority,
    setPriority,
  ] = useState(
    "Bình thường"
  )

  const [steps, setSteps] =
    useState(() => [
      createStep(),
    ])

  const [file, setFile] =
    useState(null)

  const [
    filePreview,
    setFilePreview,
  ] = useState("")

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
    signaturePosition,
    setSignaturePosition,
  ] = useState({
    page: 1,
    x: 75,
    y: 75,
  })

  const [
    draggingPage,
    setDraggingPage,
  ] = useState(null)

  const [error, setError] =
    useState("")

  const [saving, setSaving] =
    useState(false)

  // =========================
  // FILE
  // =========================

  const readFileAsDataUrl = (
    selectedFile
  ) =>
    new Promise(
      (
        resolve,
        reject
      ) => {
        const reader =
          new FileReader()

        reader.onload = () =>
          resolve(
            reader.result
          )

        reader.onerror = () =>
          reject(
            new Error(
              "Không thể đọc file."
            )
          )

        reader.readAsDataURL(
          selectedFile
        )
      }
    )

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

  const generateApprovalId = (
    savedApprovals
  ) => {
    const numbers =
      savedApprovals
        .map((item) => {
          const match =
            item.id?.match(
              /^TK-(\d+)$/
            )

          return match
            ? Number(match[1])
            : 0
        })
        .filter((number) =>
          Number.isFinite(
            number
          )
        )

    const highest =
      Math.max(
        3,
        ...numbers
      )

    return `TK-${String(
      highest + 1
    ).padStart(4, "0")}`
  }

  const handleFileChange =
    async (event) => {
      const selectedFile =
        event.target
          .files[0] ||
        null

      setError("")
      setPdfError("")
      setPdfDocument(null)
      setNumPages(0)

      setSignaturePosition({
        page: 1,
        x: 75,
        y: 75,
      })

      if (!selectedFile) {
        setFile(null)
        setFilePreview("")
        return
      }

      if (
        selectedFile.size >
        2 * 1024 * 1024
      ) {
        setFile(null)
        setFilePreview("")

        setError(
          "Prototype hiện chỉ lưu file tối đa 2 MB."
        )

        return
      }

      try {
        const data =
          await readFileAsDataUrl(
            selectedFile
          )

        setFile(
          selectedFile
        )

        setFilePreview(
          data
        )
      } catch {
        setError(
          "Không thể đọc file đã chọn."
        )
      }
    }

  // =========================
  // PDF
  // =========================

  useEffect(() => {
    if (
      !file ||
      !filePreview ||
      file.type !==
        "application/pdf"
    ) {
      setPdfDocument(null)
      setNumPages(0)
      return
    }

    let cancelled = false
    let loadedPdf = null

    const loadPdf =
      async () => {
        try {
          setPdfLoading(
            true
          )

          setPdfError("")

          const data =
            dataUrlToUint8Array(
              filePreview
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

          setPdfDocument(
            pdf
          )

          setNumPages(
            pdf.numPages
          )
        } catch (err) {
          console.error(
            err
          )

          if (!cancelled) {
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
    file,
    filePreview,
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

            const normalViewport =
              page.getViewport({
                scale: 1,
              })

            const targetWidth =
              760

            const scale =
              targetWidth /
              normalViewport.width

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
  // LUỒNG
  // =========================

  const handleAddStep =
    () => {
      setSteps([
        ...steps,
        createStep(),
      ])
    }

  const handleRemoveStep = (
    stepId
  ) => {
    if (
      steps.length === 1
    ) {
      window.alert(
        "Luồng trình ký phải có ít nhất 1 bước."
      )
      return
    }

    setSteps(
      steps.filter(
        (step) =>
          step.id !==
          stepId
      )
    )
  }

  const handleStepChange = (
    stepId,
    field,
    value
  ) => {
    setSteps(
      steps.map(
        (step) =>
          step.id ===
          stepId
            ? {
                ...step,
                [field]:
                  value,
              }
            : step
      )
    )
  }

  const handleAddHandler = (
    stepId
  ) => {
    setSteps(
      steps.map(
        (step) =>
          step.id ===
          stepId
            ? {
                ...step,

                handlers: [
                  ...step.handlers,
                  createHandler(),
                ],
              }
            : step
      )
    )
  }

  const handleRemoveHandler = (
    stepId,
    handlerId
  ) => {
    setSteps(
      steps.map(
        (step) => {
          if (
            step.id !==
            stepId
          ) {
            return step
          }

          if (
            step.handlers
              .length === 1
          ) {
            window.alert(
              "Mỗi bước phải có ít nhất 1 người xử lý."
            )

            return step
          }

          return {
            ...step,

            handlers:
              step.handlers.filter(
                (handler) =>
                  handler.id !==
                  handlerId
              ),
          }
        }
      )
    )
  }

  const handleHandlerChange = (
    stepId,
    handlerId,
    field,
    value
  ) => {
    setSteps(
      steps.map(
        (step) => {
          if (
            step.id !==
            stepId
          ) {
            return step
          }

          return {
            ...step,

            handlers:
              step.handlers.map(
                (
                  handler
                ) => {
                  if (
                    handler.id !==
                    handlerId
                  ) {
                    return handler
                  }

                  const updated = {
                    ...handler,
                    [field]:
                      value,
                  }

                  // Nếu đổi khỏi Ký duyệt
                  // thì xóa phương thức ký.
                  if (
                    field ===
                      "actionType" &&
                    value !==
                      "Ký duyệt"
                  ) {
                    updated.signatureMethod =
                      ""
                  }

                  return updated
                }
              ),
          }
        }
      )
    )
  }

  const allHandlers =
    steps.flatMap(
      (step) =>
        step.handlers
    )

  const primarySignerHandler =
    allHandlers.find(
      (handler) =>
        handler.actionType ===
          "Ký duyệt" &&
        handler.user
    )

  const primarySigner =
    primarySignerHandler
      ?.user || ""

  const primarySignatureMethod =
    primarySignerHandler
      ?.signatureMethod ||
    ""

  const primaryApprover =
    allHandlers.find(
      (handler) =>
        handler.actionType !==
          "Ký duyệt" &&
        handler.user
    )?.user ||
    primarySigner

  // =========================
  // VỊ TRÍ KÝ
  // =========================

  const updateSignaturePosition = (
    clientX,
    clientY,
    pageNumber
  ) => {
    const pageElement =
      pageRefs.current[
        pageNumber
      ]

    if (!pageElement) {
      return
    }

    const rect =
      pageElement.getBoundingClientRect()

    let x =
      ((clientX -
        rect.left) /
        rect.width) *
      100

    let y =
      ((clientY -
        rect.top) /
        rect.height) *
      100

    x = Math.max(
      10,
      Math.min(90, x)
    )

    y = Math.max(
      6,
      Math.min(94, y)
    )

    setSignaturePosition({
      page:
        pageNumber,
      x,
      y,
    })
  }

  const handlePageClick = (
    event,
    pageNumber
  ) => {
    if (
      event.target.closest(
        ".signature-box"
      )
    ) {
      return
    }

    updateSignaturePosition(
      event.clientX,
      event.clientY,
      pageNumber
    )
  }

  const handlePointerDown = (
    event,
    pageNumber
  ) => {
    event.stopPropagation()

    setDraggingPage(
      pageNumber
    )

    event.currentTarget.setPointerCapture(
      event.pointerId
    )
  }

  const handlePointerMove = (
    event,
    pageNumber
  ) => {
    if (
      draggingPage !==
      pageNumber
    ) {
      return
    }

    event.stopPropagation()

    updateSignaturePosition(
      event.clientX,
      event.clientY,
      pageNumber
    )
  }

  const handlePointerUp = (
    event
  ) => {
    event.stopPropagation()

    setDraggingPage(null)

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      )
    }
  }

  const scrollToSignaturePage =
    () => {
      const pageElement =
        pageRefs.current[
          signaturePosition.page
        ]

      if (pageElement) {
        pageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }

  // =========================
  // TẠO HỒ SƠ
  // =========================

  const handleCreate = () => {
    if (!name.trim()) {
      setError(
        "Vui lòng nhập tên hồ sơ."
      )
      return
    }

    if (!documentType) {
      setError(
        "Vui lòng chọn loại tài liệu."
      )
      return
    }

    if (!file) {
      setError(
        "Vui lòng chọn file trình ký."
      )
      return
    }

    for (
      let i = 0;
      i < steps.length;
      i += 1
    ) {
      const step =
        steps[i]

      if (
        !step.name.trim()
      ) {
        setError(
          `Vui lòng nhập tên Bước ${
            i + 1
          }.`
        )
        return
      }

      for (
        let j = 0;
        j <
        step.handlers.length;
        j += 1
      ) {
        const handler =
          step.handlers[j]

        if (!handler.user) {
          setError(
            `Vui lòng chọn người xử lý ở Bước ${
              i + 1
            }.`
          )
          return
        }

        if (
          handler.actionType ===
            "Ký duyệt" &&
          !handler.signatureMethod
        ) {
          setError(
            `Vui lòng chọn Phương thức ký cho người Ký duyệt ở Bước ${
              i + 1
            }.`
          )
          return
        }
      }
    }

    if (!primarySigner) {
      setError(
        "Luồng trình ký cần ít nhất một người có loại xử lý Ký duyệt."
      )
      return
    }

    setError("")
    setSaving(true)

    try {
      const savedApprovals =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovals"
          )
        ) || []

      const newId =
        generateApprovalId(
          savedApprovals
        )

      const normalizedSteps =
        steps.map(
          (
            step,
            index
          ) => ({
            id:
              step.id,

            step:
              index + 1,

            name:
              step.name.trim(),

            flowType:
              step.flowType,

            handlers:
              step.handlers.map(
                (
                  handler
                ) => ({
                  id:
                    handler.id,

                  user:
                    handler.user,

                  actionType:
                    handler.actionType,

                  signatureMethod:
                    handler.actionType ===
                    "Ký duyệt"
                      ? handler.signatureMethod
                      : "",
                })
              ),
          })
        )

      const initialStatus =
        primaryApprover &&
        primaryApprover !==
          primarySigner
          ? "Chờ phê duyệt"
          : "Chờ ký"

      const newApproval = {
        id:
          newId,

        name:
          name.trim(),

        description:
          description.trim(),

        documentType,

        priority,

        creator:
          "Nguyễn Văn A",

        // Giữ tương thích màn hiện tại
        approver:
          primaryApprover,

        signer:
          primarySigner,

        // Màn ký hiện tại đọc field này
        signatureMethod:
          primarySignatureMethod,

        approvalFlow:
          normalizedSteps,

        signaturePosition: {
          page:
            signaturePosition.page,

          x:
            Number(
              signaturePosition.x.toFixed(
                2
              )
            ),

          y:
            Number(
              signaturePosition.y.toFixed(
                2
              )
            ),
        },

        updatedAt:
          new Date().toLocaleDateString(
            "vi-VN"
          ),

        status:
          initialStatus,

        fileName:
          file.name,

        fileSize: `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,

        fileType:
          file.type,

        fileData:
          filePreview,
      }

      localStorage.setItem(
        "hlcApprovals",
        JSON.stringify([
          ...savedApprovals,
          newApproval,
        ])
      )

      window.location.assign(
        `/approval/${newId}`
      )
    } catch (err) {
      console.error(
        err
      )

      setError(
        "Không thể tạo hồ sơ trình ký."
      )

      setSaving(false)
    }
  }

  // =========================
  // SIGNATURE PREVIEW
  // =========================

  const renderSignatureBox = (
    pageNumber
  ) => {
    if (
      signaturePosition.page !==
      pageNumber
    ) {
      return null
    }

    return (
      <div
        className="signature-box"
        onPointerDown={(
          event
        ) =>
          handlePointerDown(
            event,
            pageNumber
          )
        }
        onPointerMove={(
          event
        ) =>
          handlePointerMove(
            event,
            pageNumber
          )
        }
        onPointerUp={
          handlePointerUp
        }
        onPointerCancel={
          handlePointerUp
        }
        style={{
          position:
            "absolute",

          left: `${signaturePosition.x}%`,

          top: `${signaturePosition.y}%`,

          transform:
            "translate(-50%, -50%)",

          width:
            "175px",

          minHeight:
            "78px",

          padding:
            "8px",

          border:
            "2px dashed #2563eb",

          background:
            "rgba(219, 234, 254, 0.94)",

          borderRadius:
            "8px",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          justifyContent:
            "center",

          textAlign:
            "center",

          color:
            "#1d4ed8",

          fontWeight:
            "700",

          cursor:
            draggingPage ===
            pageNumber
              ? "grabbing"
              : "grab",

          userSelect:
            "none",

          touchAction:
            "none",

          zIndex: 10,
        }}
      >
        <span>
          ✍️ Vùng ký
        </span>

        <small>
          {primarySigner ||
            "Người ký duyệt"}
        </small>

        <small>
          {primarySignatureMethod ||
            "Chưa chọn phương thức"}
        </small>
      </div>
    )
  }

  const renderPdfPreview =
    () => {
      if (pdfLoading) {
        return (
          <div
            style={{
              padding:
                "40px",
              textAlign:
                "center",
            }}
          >
            Đang tải PDF...
          </div>
        )
      }

      if (pdfError) {
        return (
          <div className="form-error">
            {pdfError}
          </div>
        )
      }

      if (
        !pdfDocument ||
        numPages === 0
      ) {
        return null
      }

      return (
        <div>
          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap:
                "12px",

              padding:
                "12px 14px",

              border:
                "1px solid #e5e7eb",

              background:
                "#ffffff",
            }}
          >
            <div>
              <strong>
                PDF có{" "}
                {numPages}{" "}
                trang
              </strong>

              <div
                style={{
                  fontSize:
                    "13px",

                  color:
                    "#6b7280",
                }}
              >
                Vùng ký đang ở
                trang{" "}
                {
                  signaturePosition.page
                }
              </div>
            </div>

            <button
              type="button"
              className="secondary-button"
              onClick={
                scrollToSignaturePage
              }
            >
              Đi tới vùng ký
            </button>
          </div>

          <div
            style={{
              height:
                "650px",

              overflowY:
                "auto",

              background:
                "#d1d5db",

              padding:
                "24px",
            }}
          >
            {Array.from(
              {
                length:
                  numPages,
              },
              (_, index) => {
                const pageNumber =
                  index + 1

                return (
                  <div
                    key={
                      pageNumber
                    }
                    style={{
                      marginBottom:
                        "30px",
                    }}
                  >
                    <div
                      style={{
                        textAlign:
                          "center",

                        marginBottom:
                          "8px",

                        fontWeight:
                          "600",
                      }}
                    >
                      Trang{" "}
                      {
                        pageNumber
                      }{" "}
                      /{" "}
                      {
                        numPages
                      }
                    </div>

                    <div
                      ref={(
                        element
                      ) => {
                        pageRefs.current[
                          pageNumber
                        ] =
                          element
                      }}
                      onClick={(
                        event
                      ) =>
                        handlePageClick(
                          event,
                          pageNumber
                        )
                      }
                      style={{
                        position:
                          "relative",

                        maxWidth:
                          "760px",

                        margin:
                          "0 auto",

                        background:
                          "#ffffff",

                        cursor:
                          "crosshair",

                        boxShadow:
                          "0 4px 16px rgba(0,0,0,0.18)",
                      }}
                    >
                      <canvas
                        ref={(
                          element
                        ) => {
                          canvasRefs.current[
                            pageNumber
                          ] =
                            element
                        }}
                        style={{
                          display:
                            "block",

                          width:
                            "100%",

                          height:
                            "auto",
                        }}
                      />

                      {renderSignatureBox(
                        pageNumber
                      )}
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>
      )
    }

  const renderImagePreview =
    () => {
      if (
        !filePreview ||
        !file?.type.startsWith(
          "image/"
        )
      ) {
        return null
      }

      return (
        <div
          style={{
            height:
              "650px",

            overflowY:
              "auto",

            background:
              "#d1d5db",

            padding:
              "24px",
          }}
        >
          <div
            ref={(element) => {
              pageRefs.current[
                1
              ] = element
            }}
            onClick={(event) =>
              handlePageClick(
                event,
                1
              )
            }
            style={{
              position:
                "relative",

              maxWidth:
                "760px",

              margin:
                "0 auto",

              background:
                "#ffffff",

              cursor:
                "crosshair",
            }}
          >
            <img
              src={
                filePreview
              }
              alt="Xem trước tài liệu"
              style={{
                width:
                  "100%",
                display:
                  "block",
              }}
            />

            {renderSignatureBox(
              1
            )}
          </div>
        </div>
      )
    }

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            "/approval"
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Khởi tạo trình ký
        </h1>

        <p>
          Thiết lập hồ sơ, luồng xử lý và
          vị trí ký trên tài liệu.
        </p>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      {/* 1. THÔNG TIN */}

      <div className="detail-card">
        <h2>
          1. Thông tin hồ sơ trình ký
        </h2>

        <div className="upload-form">
          <div className="form-group">
            <label>
              Tên hồ sơ *
            </label>

            <input
              type="text"
              value={name}
              placeholder="Nhập tên hồ sơ trình ký"
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />
          </div>

          <div className="detail-grid">
            <div className="form-group">
              <label>
                Loại tài liệu *
              </label>

              <select
                value={
                  documentType
                }
                onChange={(e) =>
                  setDocumentType(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Chọn loại tài liệu
                </option>

                {documentCategories.map(
                  (
                    category
                  ) => (
                    <option
                      key={
                        category.id ||
                        category.name
                      }
                      value={
                        category.name
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>
                Mức độ ưu tiên *
              </label>

              <select
                value={
                  priority
                }
                onChange={(e) =>
                  setPriority(
                    e.target.value
                  )
                }
              >
                {priorityOptions.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              Nội dung trình ký
            </label>

            <textarea
              rows="4"
              value={
                description
              }
              placeholder="Nhập nội dung trình ký..."
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />
          </div>

          <div className="form-group">
            <label>
              File trình ký *
            </label>

            <input
              type="file"
              accept=".pdf,image/*"
              onChange={
                handleFileChange
              }
            />

            {file && (
              <small>
                Đã chọn:{" "}
                {file.name} -{" "}
                {(
                  file.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </small>
            )}

            <small>
              Prototype hiện hỗ trợ file
              tối đa 2 MB.
            </small>
          </div>
        </div>
      </div>

      {/* 2. LUỒNG */}

      <div className="detail-card">
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap:
              "12px",
          }}
        >
          <div>
            <h2>
              2. Thiết lập luồng trình ký
            </h2>

            <p
              style={{
                color:
                  "#6b7280",
              }}
            >
              Tạo bước và thêm người xử
              lý cho từng bước.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={
              handleAddStep
            }
          >
            + Thêm bước
          </button>
        </div>

        {steps.map(
          (
            step,
            stepIndex
          ) => (
            <div
              key={
                step.id
              }
              style={{
                border:
                  "1px solid #dbe3ee",

                borderRadius:
                  "10px",

                padding:
                  "18px",

                marginTop:
                  "18px",

                background:
                  "#f9fbfd",
              }}
            >
              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  marginBottom:
                    "16px",
                }}
              >
                <strong>
                  Bước{" "}
                  {stepIndex +
                    1}
                </strong>

                <button
                  type="button"
                  className="reject-button"
                  onClick={() =>
                    handleRemoveStep(
                      step.id
                    )
                  }
                >
                  Xóa bước
                </button>
              </div>

              <div className="detail-grid">
                <div className="form-group">
                  <label>
                    Tên bước *
                  </label>

                  <input
                    type="text"
                    placeholder="Ví dụ: Kiểm tra nội dung"
                    value={
                      step.name
                    }
                    onChange={(e) =>
                      handleStepChange(
                        step.id,
                        "name",
                        e.target
                          .value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label>
                    Loại bước *
                  </label>

                  <select
                    value={
                      step.flowType
                    }
                    onChange={(e) =>
                      handleStepChange(
                        step.id,
                        "flowType",
                        e.target
                          .value
                      )
                    }
                  >
                    {flowTypeOptions.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                        >
                          {
                            item
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "space-between",

                  alignItems:
                    "center",

                  marginTop:
                    "8px",
                }}
              >
                <strong>
                  Người xử lý
                </strong>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleAddHandler(
                      step.id
                    )
                  }
                >
                  + Thêm người xử lý
                </button>
              </div>

              {step.handlers.map(
                (
                  handler,
                  handlerIndex
                ) => (
                  <div
                    key={
                      handler.id
                    }
                    style={{
                      borderTop:
                        "1px solid #e5e7eb",

                      marginTop:
                        "14px",

                      paddingTop:
                        "14px",
                    }}
                  >
                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        marginBottom:
                          "10px",
                      }}
                    >
                      <span>
                        Người xử lý{" "}
                        {handlerIndex +
                          1}
                      </span>

                      <button
                        type="button"
                        className="reject-button"
                        onClick={() =>
                          handleRemoveHandler(
                            step.id,
                            handler.id
                          )
                        }
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="detail-grid">
                      <div className="form-group">
                        <label>
                          Chọn người *
                        </label>

                        <select
                          value={
                            handler.user
                          }
                          onChange={(e) =>
                            handleHandlerChange(
                              step.id,
                              handler.id,
                              "user",
                              e.target
                                .value
                            )
                          }
                        >
                          <option value="">
                            Chọn người xử lý
                          </option>

                          {prototypeUsers.map(
                            (
                              user
                            ) => (
                              <option
                                key={
                                  user
                                }
                                value={
                                  user
                                }
                              >
                                {
                                  user
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>
                          Loại xử lý *
                        </label>

                        <select
                          value={
                            handler.actionType
                          }
                          onChange={(e) =>
                            handleHandlerChange(
                              step.id,
                              handler.id,
                              "actionType",
                              e.target
                                .value
                            )
                          }
                        >
                          {actionTypeOptions.map(
                            (
                              item
                            ) => (
                              <option
                                key={
                                  item
                                }
                                value={
                                  item
                                }
                              >
                                {
                                  item
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    {handler.actionType ===
                      "Ký duyệt" && (
                      <div className="form-group">
                        <label>
                          Phương thức ký *
                        </label>

                        <select
                          value={
                            handler.signatureMethod
                          }
                          onChange={(e) =>
                            handleHandlerChange(
                              step.id,
                              handler.id,
                              "signatureMethod",
                              e.target
                                .value
                            )
                          }
                        >
                          <option value="">
                            Chọn phương thức ký
                          </option>

                          {signatureMethodOptions.map(
                            (
                              method
                            ) => (
                              <option
                                key={
                                  method
                                }
                                value={
                                  method
                                }
                              >
                                {
                                  method
                                }
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )
        )}

        <div
          className="settings-note"
          style={{
            marginTop:
              "16px",
          }}
        >
          <strong>
            Người ký duyệt chính:
          </strong>{" "}
          {primarySigner ||
            "Chưa chọn"}
          <br />
          <strong>
            Phương thức:
          </strong>{" "}
          {primarySignatureMethod ||
            "Chưa chọn"}
        </div>
      </div>

      {/* 3. VỊ TRÍ KÝ */}

      <div className="detail-card">
        <h2>
          3. Thiết lập vị trí ký
        </h2>

        <p
          style={{
            color:
              "#6b7280",
          }}
        >
          Chọn người có loại xử lý{" "}
          <strong>
            Ký duyệt
          </strong>{" "}
          trước, sau đó bấm vào vị trí cần
          ký trên tài liệu.
        </p>

        {!file && (
          <div
            style={{
              padding:
                "50px",

              textAlign:
                "center",

              border:
                "1px dashed #d1d5db",

              borderRadius:
                "10px",

              color:
                "#6b7280",
            }}
          >
            Hãy chọn file ở phần thông tin
            hồ sơ.
          </div>
        )}

        {file?.type ===
          "application/pdf" &&
          renderPdfPreview()}

        {file?.type.startsWith(
          "image/"
        ) &&
          renderImagePreview()}

        {filePreview && (
          <div
            className="settings-note"
            style={{
              marginTop:
                "16px",
            }}
          >
            <strong>
              Vị trí ký:
            </strong>{" "}
            Trang{" "}
            {
              signaturePosition.page
            }
            {" - "}
            X{" "}
            {signaturePosition.x.toFixed(
              0
            )}
            %
            {" - "}
            Y{" "}
            {signaturePosition.y.toFixed(
              0
            )}
            %
          </div>
        )}
      </div>

      {/* KIỂM TRA */}

      <div className="detail-card">
        <h2>
          Kiểm tra trước khi tạo
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Loại tài liệu
            </span>

            <p>
              {documentType ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Mức độ ưu tiên
            </span>

            <p>
              {priority}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Số bước
            </span>

            <p>
              {steps.length}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người ký duyệt
            </span>

            <p>
              {primarySigner ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Phương thức ký
            </span>

            <p>
              {primarySignatureMethod ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Trang ký
            </span>

            <p>
              Trang{" "}
              {
                signaturePosition.page
              }
            </p>
          </div>
        </div>

        {error && (
          <div
            className="form-error"
            style={{
              marginTop:
                "16px",
            }}
          >
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            className="secondary-button"
            onClick={() =>
              navigate(
                "/approval"
              )
            }
          >
            Hủy
          </button>

          <button
            className="primary-button"
            onClick={
              handleCreate
            }
            disabled={
              saving
            }
          >
            {saving
              ? "Đang tạo..."
              : "Khởi tạo trình ký"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApprovalCreatePage