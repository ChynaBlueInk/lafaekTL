"use client"

export default function TestMagazinePage() {
  const createMagazine = async () => {
    const response = await fetch("/api/magazines-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Lafaek Kiik",
        issue: "Issue 001",
        language: "Tetun",
        category: "Early Childhood",
        coverImage: "",
        pages: [],
        published: false,
      }),
    })

    const data = await response.json()

    console.log(data)

    alert(JSON.stringify(data, null, 2))
  }

  return (
    <div className="p-8">
      <button
        onClick={createMagazine}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Create Test Magazine
      </button>
    </div>
  )
}