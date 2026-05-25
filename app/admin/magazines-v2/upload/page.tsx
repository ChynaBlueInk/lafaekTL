"use client"

import {useState} from "react"

export default function MagazineUploadPage() {

  const [title,setTitle] = useState("")
  const [issue,setIssue] = useState("")
  const [language,setLanguage] = useState("")
  const [category,setCategory] = useState("")
  const [published,setPublished] = useState(false)

  const [coverFile,setCoverFile] = useState<File | null>(null)
  const [pageFiles,setPageFiles] = useState<File[]>([])

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Upload Magazine
      </h1>

      <div className="space-y-4">

        <div>
          <label className="block mb-1 font-medium">
            Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Issue
          </label>

          <input
            type="text"
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Language
          </label>

          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Category
          </label>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />

          <label>
            Published
          </label>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null
              setCoverFile(file)
            }}
            className="block w-full"
          />

          <p className="text-sm text-gray-500 mt-2">
            {coverFile ? coverFile.name : "No cover selected"}
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Magazine Pages
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || [])
              setPageFiles(files)
            }}
            className="block w-full"
          />

          <p className="text-sm text-gray-500 mt-2">
            {pageFiles.length} page(s) selected
          </p>
        </div>

        <button
          onClick={async() => {

            if(!coverFile){
              alert("Please select a cover image")
              return
            }

            if(pageFiles.length === 0){
              alert("Please select magazine pages")
              return
            }

            try {

              // =====================
              // UPLOAD COVER
              // =====================

              const coverPresignRes = await fetch("/api/uploads/s3/presign",{
                method:"POST",
                headers:{
                  "Content-Type":"application/json"
                },
                body:JSON.stringify({
                  fileName:coverFile.name,
                  contentType:coverFile.type,
                  folder:"magazines/covers"
                })
              })

              const coverPresignData = await coverPresignRes.json()

              const coverFormData = new FormData()

              Object.entries(coverPresignData.fields).forEach(([key,value]) => {
                coverFormData.append(key,value as string)
              })

              coverFormData.append("file",coverFile)

              const coverUploadRes = await fetch(coverPresignData.url,{
                method:"POST",
                body:coverFormData
              })

              if(coverUploadRes.status !== 201){
                alert("Cover upload failed")
                return
              }

              console.log("COVER UPLOADED")

              // =====================
              // UPLOAD PAGE FILES
              // =====================

              const uploadedPages = []

              for(const file of pageFiles){

                const presignRes = await fetch("/api/uploads/s3/presign",{
                  method:"POST",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({
                    fileName:file.name,
                    contentType:file.type,
                    folder:"magazines/pages"
                  })
                })

                const presignData = await presignRes.json()

                const formData = new FormData()

                Object.entries(presignData.fields).forEach(([key,value]) => {
                  formData.append(key,value as string)
                })

                formData.append("file",file)

                const uploadRes = await fetch(presignData.url,{
                  method:"POST",
                  body:formData
                })

                if(uploadRes.status !== 201){
                  alert(`Failed uploading ${file.name}`)
                  return
                }

                uploadedPages.push({
                  pageNumber: uploadedPages.length + 1,
                  imageUrl: presignData.publicUrl
                })

                console.log("UPLOADED PAGE",file.name)
              }

              console.log("ALL PAGES UPLOADED",uploadedPages)

              alert("Magazine files uploaded successfully!")

            } catch(error){
              console.error(error)
              alert("Upload failed")
            }

          }}
          className="bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Save Magazine
        </button>

      </div>

    </div>
  )
}