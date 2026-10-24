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

  const defaultSignatures = [
    {
      id: "SIGN-001",
      name: "SmartCA",
    },
    {
      id: "SIGN-002",
      name: "USB Token",
    },
  ]

  const savedSignatures =
    JSON.parse(
      localStorage.getItem(
        "hlcDigitalSignatures"
      )
    )

  const signatureMethods =
    savedSignatures !== null
      ? savedSignatures
      : defaultSignatures

  const [name, setName] =
    useState("")

  const [
    description,
    setDescription,
  ] = useState("")

  const [approver, setApprover] =
    useState("")

  const [signer, setSigner] =
    useState("")

  const [
    signatureMethod,
    setSignatureMethod,
  ] = useState("")

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

  const [numPages, setNumPages] =
    useState(0)

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

  const readFileAsDataUrl = (
    selectedFile
  ) => {
    return new Promise(
      (resolve, reject) => {
        const reader =
          new FileReader()

        reader.onload = () => {
          resolve(reader.result)
        }

        reader.onerror = () => {
          reject(
            new Error(
              "Không thể đọc file."
            )
          )
        }

        reader.readAsDataURL(
          selectedFile
        )
      }
    )
  }

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
          Number.isFinite(number)
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

  const handleFileChange = async (
    event
  ) => {
    const selectedFile =
      event.target.files[0] ||
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

      setFile(selectedFile)
      setFilePreview(data)
    } catch {
      setError(
        "Không thể đọc file đã chọn."
      )
    }
  }

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

    const loadPdf = async () => {
      try {
        setPdfLoading(true)
        setPdfError("")

        const pdfData =
          dataUrlToUint8Array(
            filePreview
          )

        const loadingTask =
          pdfjsLib.getDocument({
            data: pdfData,
          })

        const pdf =
          await loadingTask.promise

        if (cancelled) {
          await pdf.destroy()
          return
        }

        loadedPdf = pdf

        setPdfDocument(pdf)
        setNumPages(pdf.numPages)
      } catch (err) {
        console.error(err)

        if (!cancelled) {
          setPdfError(
            "Không thể hiển thị file PDF."
          )
        }
      } finally {
        if (!cancelled) {
          setPdfLoading(false)
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
  }, [file, filePreview])

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

            const normalViewport =
              page.getViewport({
                scale: 1,
              })

            const targetWidth = 760

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
              canvas.getContext("2d")

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
      ((clientX - rect.left) /
        rect.width) *
      100

    let y =
      ((clientY - rect.top) /
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
      page: pageNumber,
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

  const handleCreate = () => {
    if (!name.trim()) {
      setError(
        "Vui lòng nhập tên hồ sơ."
      )
      return
    }

    if (!approver) {
      setError(
        "Vui lòng chọn người phê duyệt."
      )
      return
    }

    if (!signer) {
      setError(
        "Vui lòng chọn người ký."
      )
      return
    }

    if (!signatureMethod) {
      setError(
        "Vui lòng chọn loại/phương thức ký."
      )
      return
    }

    if (!file) {
      setError(
        "Vui lòng chọn file trình ký."
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

      const newApproval = {
        id: newId,

        name:
          name.trim(),

        description:
          description.trim(),

        creator:
          "Nguyễn Văn A",

        approver,

        signer,

        approvalFlow: [
          {
            step: 1,
            type:
              "Phê duyệt",
            user:
              approver,
          },
          {
            step: 2,
            type: "Ký",
            user:
              signer,
          },
        ],

        signatureMethod,

        signaturePosition: {
          page:
            signaturePosition.page,

          x: Number(
            signaturePosition.x.toFixed(
              2
            )
          ),

          y: Number(
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
          "Chờ phê duyệt",

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

      // QUAN TRỌNG:
      // tải lại trực tiếp trang chi tiết
      // để tránh màn trắng sau khi tạo.
      window.location.assign(
        `/approval/${newId}`
      )
    } catch (err) {
      console.error(err)

      setError(
        "Không thể tạo hồ sơ trình ký."
      )

      setSaving(false)
    }
  }

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
        onPointerDown={(event) =>
          handlePointerDown(
            event,
            pageNumber
          )
        }
        onPointerMove={(event) =>
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
          position: "absolute",

          left: `${signaturePosition.x}%`,

          top: `${signaturePosition.y}%`,

          transform:
            "translate(-50%, -50%)",

          width: "150px",

          minHeight: "68px",

          padding: "8px",

          border:
            "2px dashed #2563eb",

          background:
            "rgba(219, 234, 254, 0.92)",

          borderRadius: "8px",

          display: "flex",

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

          userSelect: "none",

          touchAction: "none",

          zIndex: 10,

          boxShadow:
            "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <span>
          ✍️ Vùng ký
        </span>

        <small>
          Trang {pageNumber}
        </small>

        <small>
          {signatureMethod ||
            "Chưa chọn loại ký"}
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
            position: "sticky",
            top: 0,
            zIndex: 20,

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap: "12px",

            padding:
              "10px 14px",

            background:
              "#ffffff",

            borderBottom:
              "1px solid #e5e7eb",
          }}
        >
          <div>
            <strong>
              PDF có {numPages} trang
            </strong>

            <div
              style={{
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Vùng ký đang ở trang{" "}
              {signaturePosition.page}
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
            height: "650px",
            overflowY: "auto",
            background:
              "#d1d5db",
            padding: "24px",
          }}
        >
          {Array.from(
            {
              length: numPages,
            },
            (_, index) => {
              const pageNumber =
                index + 1

              return (
                <div
                  key={pageNumber}
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
                      color:
                        "#374151",
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

                      width:
                        "100%",

                      maxWidth:
                        "760px",

                      margin:
                        "0 auto",

                      background:
                        "#ffffff",

                      boxShadow:
                        "0 4px 16px rgba(0,0,0,0.18)",

                      cursor:
                        "crosshair",
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

  const renderImagePreview = () => {
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
          height: "650px",
          overflowY: "auto",
          background:
            "#d1d5db",
          padding: "24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          Trang 1 / 1
        </div>

        <div
          ref={(element) => {
            pageRefs.current[1] =
              element
          }}
          onClick={(event) =>
            handlePageClick(
              event,
              1
            )
          }
          style={{
            position: "relative",
            maxWidth: "760px",
            margin: "0 auto",
            background: "#ffffff",
            cursor: "crosshair",
          }}
        >
          <img
            src={filePreview}
            alt="Xem trước tài liệu"
            style={{
              width: "100%",
              display: "block",
            }}
          />

          {renderSignatureBox(1)}
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
          Thiết lập hồ sơ, luồng xử lý
          và vị trí ký trên tài liệu.
        </p>
      </div>

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="detail-card">
        <h2>
          1. Thông tin hồ sơ
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

          <div className="form-group">
            <label>
              Nội dung trình ký
            </label>

            <textarea
              rows="4"
              value={description}
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

      <div className="detail-card">
        <h2>
          2. Thiết lập luồng trình ký
        </h2>

        <div className="detail-grid">
          <div className="form-group">
            <label>
              Bước 1 - Người phê duyệt *
            </label>

            <select
              value={approver}
              onChange={(e) =>
                setApprover(
                  e.target.value
                )
              }
            >
              <option value="">
                Chọn người phê duyệt
              </option>

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

          <div className="form-group">
            <label>
              Bước 2 - Người ký *
            </label>

            <select
              value={signer}
              onChange={(e) =>
                setSigner(
                  e.target.value
                )
              }
            >
              <option value="">
                Chọn người ký
              </option>

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

        {(approver || signer) && (
          <div className="settings-note">
            Người khởi tạo →{" "}
            <strong>
              {approver ||
                "Chưa chọn"}
            </strong>{" "}
            phê duyệt →{" "}
            <strong>
              {signer ||
                "Chưa chọn"}
            </strong>{" "}
            ký → Hoàn tất
          </div>
        )}
      </div>

      <div className="detail-card">
        <h2>
          3. Loại / phương thức ký
        </h2>

        <div className="form-group">
          <label>
            Phương thức ký *
          </label>

          <select
            value={
              signatureMethod
            }
            onChange={(e) =>
              setSignatureMethod(
                e.target.value
              )
            }
          >
            <option value="">
              Chọn phương thức ký
            </option>

            {signatureMethods.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.name}
                >
                  {item.name}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="detail-card">
        <h2>
          4. Thiết lập vị trí ký
        </h2>

        <p
          style={{
            color: "#6b7280",
          }}
        >
          Cuộn tới trang muốn ký rồi{" "}
          <strong>
            bấm trực tiếp vào vị trí cần ký
          </strong>
          . Sau đó có thể kéo ô{" "}
          <strong>
            Vùng ký
          </strong>{" "}
          để chỉnh lại vị trí.
        </p>

        {!file && (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              background:
                "#f9fafb",
              border:
                "1px dashed #d1d5db",
              borderRadius: "10px",
              color: "#6b7280",
            }}
          >
            Hãy chọn file ở bước 1 để
            xem trước tài liệu.
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
              marginTop: "16px",
            }}
          >
            <strong>
              Vị trí ký:
            </strong>{" "}
            Trang{" "}
            {signaturePosition.page}
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

      <div className="detail-card">
        <h2>
          Kiểm tra trước khi tạo
        </h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">
              Người phê duyệt
            </span>

            <p>
              {approver ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Người ký
            </span>

            <p>
              {signer ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Phương thức ký
            </span>

            <p>
              {signatureMethod ||
                "Chưa chọn"}
            </p>
          </div>

          <div>
            <span className="detail-label">
              Trang ký
            </span>

            <p>
              Trang{" "}
              {signaturePosition.page}
            </p>
          </div>
        </div>

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
            disabled={saving}
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