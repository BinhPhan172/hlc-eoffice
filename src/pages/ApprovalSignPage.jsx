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

  const canvasRefs = useRef({})
  const pageRefs = useRef({})

  const prototypeUsers = [
    "Nguyễn Văn A",
    "Trần Thị B",
    "Lê Văn C",
    "Phạm Văn D",
  ]

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
      updatedAt:
        "22/10/2026",
      status:
        "Chờ phê duyệt",
      fileName:
        "de-nghi-mua-sam-thiet-bi.pdf",
      fileData: "",
      fileType:
        "application/pdf",
      signatureMethod: "",
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
      updatedAt:
        "21/10/2026",
      status:
        "Chờ ký",
      fileName:
        "quyet-dinh-dieu-dong.pdf",
      fileData: "",
      fileType:
        "application/pdf",
      signatureMethod: "",
      signaturePosition: null,
    },
    {
      id: "TK-0003",
      name:
        "Đề xuất kế hoạch đào tạo",
      creator:
        "Lê Văn C",
      approver:
        "Phạm Văn D",
      signer:
        "Phạm Văn D",
      updatedAt:
        "20/10/2026",
      status:
        "Hoàn tất",
      fileName:
        "ke-hoach-dao-tao.pdf",
      fileData: "",
      fileType:
        "application/pdf",
      signatureMethod:
        "SmartCA",
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

  const savedDelegates =
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
      (item) => item.id === id
    )

  const delegatedSigner =
    savedDelegates[id] || ""

  const signerName =
    delegatedSigner ||
    approval?.signer ||
    approval?.approver ||
    ""

  const currentStatus =
    approval
      ? statusOverrides[id] ||
        approval.status
      : ""

  const signatureMethod =
    approval?.signatureMethod || ""

  const signaturePage =
    approval?.signaturePosition
      ?.page || null

  const signatureX =
    approval?.signaturePosition
      ?.x ?? null

  const signatureY =
    approval?.signaturePosition
      ?.y ?? null

  const fileData =
    approval?.fileData || ""

  const fileType =
    approval?.fileType || ""

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
      i < binaryString.length;
      i += 1
    ) {
      bytes[i] =
        binaryString.charCodeAt(i)
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
          pageNumber <= numPages;
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

            if (cancelled) {
              return
            }

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
                `Không thể render trang ${pageNumber}`,
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
          ← Quay lại danh sách
        </button>
      </div>
    )
  }

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

  const handleGoToSignature =
    () => {
      if (!signaturePage) {
        return
      }

      const targetPage =
        pageRefs.current[
          signaturePage
        ]

      if (targetPage) {
        targetPage.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }

  const handleSign = () => {
    if (
      currentStatus !==
      "Chờ ký"
    ) {
      setError(
        "Hồ sơ hiện không ở trạng thái chờ ký."
      )
      return
    }

    if (
      currentUser !== signerName
    ) {
      setError(
        `Hồ sơ hiện đang chờ ${signerName} ký.`
      )
      return
    }

    if (!signatureMethod) {
      setError(
        "Hồ sơ chưa được thiết lập phương thức ký."
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
        `Xác nhận ký hồ sơ bằng ${signatureMethod} tại trang ${signaturePage}?`
      )

    if (!confirmed) {
      return
    }

    setSigning(true)
    setError("")

    try {
      const currentStatuses =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalStatus"
          )
        ) || {}

      currentStatuses[id] =
        "Hoàn tất"

      localStorage.setItem(
        "hlcApprovalStatus",
        JSON.stringify(
          currentStatuses
        )
      )

      const signatures =
        JSON.parse(
          localStorage.getItem(
            "hlcApprovalSignatures"
          )
        ) || {}

      signatures[id] = {
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
          Boolean(
            delegatedSigner
          ),

        signedAt:
          new Date().toLocaleString(
            "vi-VN"
          ),
      }

      localStorage.setItem(
        "hlcApprovalSignatures",
        JSON.stringify(
          signatures
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
            `Đã ký tài liệu bằng ${signatureMethod} tại trang ${signaturePage}.`,

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

      // QUAN TRỌNG:
      // reload thẳng trang chi tiết
      // để tránh màn trắng sau khi ký.
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

  const canSign =
    currentStatus ===
      "Chờ ký" &&
    currentUser ===
      signerName &&
    Boolean(
      signatureMethod
    ) &&
    Boolean(signaturePage)

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
          position: "absolute",

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

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <span>
          ✍️ Vùng ký
        </span>

        <small>
          {signerName}
        </small>

        <small>
          {signatureMethod}
        </small>
      </div>
    )
  }

  const renderPdfPreview = () => {
    if (pdfLoading) {
      return (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
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
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "12px",
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
              PDF có {numPages} trang
            </strong>

            <div
              style={{
                fontSize:
                  "13px",
                color:
                  "#6b7280",
              }}
            >
              Vùng ký ở trang{" "}
              {signaturePage}
            </div>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={
              handleGoToSignature
            }
          >
            Đi tới vùng ký
          </button>
        </div>

        <div
          style={{
            height: "650px",
            overflowY: "auto",
            background:
              "#d1d5db",
            padding: "24px",
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
                    {pageNumber} /{" "}
                    {numPages}
                  </div>

                  <div
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
                        "0 auto",
                      background:
                        "#ffffff",
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
                        ] = element
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

  return (
    <div>
      <button
        onClick={() =>
          navigate(
            `/approval/${id}`
          )
        }
      >
        ← Quay lại
      </button>

      <div className="detail-header">
        <h1>
          Ký tài liệu
        </h1>

        <p>
          Mã hồ sơ:{" "}
          {approval.id}
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

      {delegatedSigner && (
        <div className="success-message">
          Hồ sơ đã được ủy quyền ký cho{" "}
          <strong>
            {delegatedSigner}
          </strong>
          .
        </div>
      )}

      <div className="detail-card">
        <h2>
          Thông tin ký
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Tên hồ sơ
            </span>

            <p>
              {approval.name}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người ký
            </span>

            <p>
              {signerName}
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
              Trang ký
            </span>

            <p>
              {signaturePage
                ? `Trang ${signaturePage}`
                : "Chưa thiết lập"}
            </p>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          Kiểm tra vị trí ký
        </h2>

        {!fileData && (
          <div className="settings-note">
            Hồ sơ chưa có dữ liệu file để
            xem trước.
          </div>
        )}

        {fileData &&
          fileType ===
            "application/pdf" &&
          renderPdfPreview()}
      </div>

      <div className="detail-card">
        <h2>
          Xác nhận ký tài liệu
        </h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

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
            onClick={
              handleSign
            }
            disabled={
              !canSign ||
              signing
            }
          >
            {signing
              ? "Đang ký..."
              : `Ký bằng ${
                  signatureMethod ||
                  "chữ ký số"
                }`}
          </button>
        </div>
      </div>

      <div className="settings-note">
        <strong>
          Ghi chú prototype
        </strong>

        <p>
          Thao tác ký hiện đang mô phỏng,
          chưa gọi API ký số thực tế.
        </p>
      </div>
    </div>
  )
}

export default ApprovalSignPage