// app/magazines/apply/page.tsx
"use client";

import {FormEvent,useState}from "react";
import Link from "next/link";

const LAFAEK={
  green:"#219653",
  red:"#EB5757",
  grayLight:"#F5F5F5",
  grayMid:"#BDBDBD",
  textDark:"#4F4F4F",
  blue:"#2F80ED",
  yellow:"#F2C94C",
};

type ApplyingAs="school"|"community";

type SchoolType="government"|"catholic"|"ngo"|"private"|"other";

type FormState={
  applyingAs:ApplyingAs;
  schoolName:string;
  district:string;
  schoolType:SchoolType;
  numStudents:string; // keep as string for input, convert to number on submit
  contactName:string;
  contactRole:string;
  contactEmail:string;
  contactPhone:string;
  justification:string;
  isCommunityOrg:boolean;
  organisationName:string;
};

const initialForm:FormState={
  applyingAs:"school",
  schoolName:"",
  district:"",
  schoolType:"government",
  numStudents:"",
  contactName:"",
  contactRole:"",
  contactEmail:"",
  contactPhone:"",
  justification:"",
  isCommunityOrg:false,
  organisationName:"",
};

export default function MagazineApplyPage(){
  const[form,setForm]=useState<FormState>(initialForm);
  const[submitting,setSubmitting]=useState(false);
  const[successMessage,setSuccessMessage]=useState<string>("");
  const[errorMessage,setErrorMessage]=useState<string>("");

  const handleChange=(field:keyof FormState,value:string|boolean)=>{
    setForm((prev)=>({
      ...prev,
      [field]:value,
    }));
  };

  const handleSubmit=async(e:FormEvent)=>{
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // basic client-side validation
    if(!form.schoolName.trim()
      ||!form.district.trim()
      ||!form.contactName.trim()
      ||!form.justification.trim()
      ||!form.numStudents.trim()
    ){
      setErrorMessage("Please fill in all required fields (marked with *).");
      return;
    }

    const numStudentsNumber=Number(form.numStudents);
    if(Number.isNaN(numStudentsNumber)||numStudentsNumber<=0){
      setErrorMessage("Please enter a valid number of students.");
      return;
    }

    const payload={
      schoolName:form.schoolName.trim(),
      district:form.district.trim(),
      schoolType:form.schoolType,
      numStudents:numStudentsNumber,
      contactName:form.contactName.trim(),
      contactRole:form.contactRole.trim()||undefined,
      contactEmail:form.contactEmail.trim()||undefined,
      contactPhone:form.contactPhone.trim()||undefined,
      justification:form.justification.trim(),
      isCommunityOrg:form.applyingAs==="community"||form.isCommunityOrg,
      organisationName:form.organisationName.trim()||undefined,
    };

    try{
      setSubmitting(true);
      const res=await fetch("/api/magazines/apply",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
      });

      if(!res.ok){
        const data=await res.json().catch(()=>null);
        throw new Error(data?.error||`Request failed with status ${res.status}`);
      }

      setSuccessMessage("Thank you. Your request has been submitted. Our team will review it and contact you if needed.");
      setErrorMessage("");
      setForm(initialForm);
    }catch(err:any){
      setErrorMessage(err?.message||"Sorry, something went wrong while submitting your request.");
      setSuccessMessage("");
    }finally{
      setSubmitting(false);
    }
  };

  return(
    <div className="min-h-screen bg-white">
      {/* Header / breadcrumb */}
      <div className="w-full border-b" style={{borderColor:LAFAEK.grayMid}}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">
              <Link href="/magazines" className="underline">
                Lafaek Magazines
              </Link>{" "}
              / Apply for access
            </p>
            <h1 className="text-2xl md:text-3xl font-bold" style={{color:LAFAEK.green}}>
              Apply for Magazine Access
            </h1>
            <p className="text-sm text-gray-700 max-w-2xl">
              This form is for schools and community organisations who would like to receive{" "}
              <span className="font-semibold">full access</span> to Lafaek magazines, either through school
              distribution or sponsorship.
            </p>
          </div>
          <Link
            href="/publication/magazines"
            className="hidden md:inline-flex px-3 py-2 rounded-lg text-sm font-medium border"
            style={{borderColor:LAFAEK.grayMid,color:LAFAEK.textDark}}
          >
            View magazine archive
          </Link>
        </div>
      </div>

      {/* Form container */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-10">
        <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
          {/* Form card */}
          <section
            className="rounded-2xl border bg-white shadow-sm p-5 md:p-6 space-y-5"
            style={{borderColor:LAFAEK.grayMid}}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Applying as */}
              <div>
                <h2 className="text-sm font-semibold mb-2" style={{color:LAFAEK.textDark}}>
                  Who is applying? <span className="text-red-600">*</span>
                </h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={()=>handleChange("applyingAs","school")}
                    className={`px-3 py-2 rounded-full text-sm font-medium border ${
                      form.applyingAs==="school"
                        ? "shadow-sm"
                        : ""
                    }`}
                    style={{
                      borderColor:form.applyingAs==="school"?LAFAEK.green:LAFAEK.grayMid,
                      background:form.applyingAs==="school"?"#E8F6EE":"#FFFFFF",
                      color:LAFAEK.textDark,
                    }}
                  >
                    School
                  </button>
                  <button
                    type="button"
                    onClick={()=>{
                      handleChange("applyingAs","community");
                      handleChange("isCommunityOrg",true);
                    }}
                    className={`px-3 py-2 rounded-full text-sm font-medium border ${
                      form.applyingAs==="community"
                        ? "shadow-sm"
                        : ""
                    }`}
                    style={{
                      borderColor:form.applyingAs==="community"?LAFAEK.green:LAFAEK.grayMid,
                      background:form.applyingAs==="community"?"#E8F6EE":"#FFFFFF",
                      color:LAFAEK.textDark,
                    }}
                  >
                    Community / NGO / Organisation
                  </button>
                </div>
              </div>

              {/* School / organisation details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    {form.applyingAs==="school"?"School name *":"School / organisation name *"}
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.schoolName}
                    onChange={(e)=>handleChange("schoolName",e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    District / Municipality *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    placeholder="e.g. Ermera, Bobonaro, Dili"
                    value={form.district}
                    onChange={(e)=>handleChange("district",e.target.value)}
                  />
                </div>
              </div>

              {/* School type + students + organisation name */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    School type *
                  </label>
                  <select
                    className="w-full rounded-lg border px-3 py-2 text-sm bg-white"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.schoolType}
                    onChange={(e)=>handleChange("schoolType",e.target.value as SchoolType)}
                  >
                    <option value="government">Government</option>
                    <option value="catholic">Catholic</option>
                    <option value="ngo">NGO school</option>
                    <option value="private">Private</option>
                    <option value="other">Other / community</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Approx. number of students *
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.numStudents}
                    onChange={(e)=>handleChange("numStudents",e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Community / NGO name (if different)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.organisationName}
                    onChange={(e)=>handleChange("organisationName",e.target.value)}
                  />
                </div>
              </div>

              {/* Contact details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Contact person name *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.contactName}
                    onChange={(e)=>handleChange("contactName",e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Role / position
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    placeholder="e.g. Principal, teacher, NGO coordinator"
                    value={form.contactRole}
                    onChange={(e)=>handleChange("contactRole",e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Email (if available)
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.contactEmail}
                    onChange={(e)=>handleChange("contactEmail",e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{borderColor:LAFAEK.grayMid}}
                    value={form.contactPhone}
                    onChange={(e)=>handleChange("contactPhone",e.target.value)}
                  />
                </div>
              </div>

              {/* Justification */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">
                  Why does your school / organisation need access to Lafaek magazines? *
                </label>
                <textarea
                  className="w-full rounded-lg border px-3 py-2 text-sm min-h-[120px]"
                  style={{borderColor:LAFAEK.grayMid}}
                  placeholder="e.g. remote location, lack of books, multi-grade classrooms, using Lafaek to support Portuguese/Tetun literacy, community learning centre, etc."
                  value={form.justification}
                  onChange={(e)=>handleChange("justification",e.target.value)}
                />
              </div>

              {/* Messages */}
              {errorMessage&&(
                <div className="rounded-md border px-3 py-2 text-sm bg-red-50 text-red-700 border-red-200">
                  {errorMessage}
                </div>
              )}
              {successMessage&&(
                <div className="rounded-md border px-3 py-2 text-sm bg-emerald-50 text-emerald-800 border-emerald-200">
                  {successMessage}
                </div>
              )}

              {/* Submit */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  href="/magazines"
                  className="text-sm underline text-gray-600"
                >
                  ← Back to magazine overview
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm disabled:opacity-60"
                  style={{background:LAFAEK.green,color:"#FFFFFF"}}
                >
                  {submitting?"Submitting...":"Submit request"}
                </button>
              </div>
            </form>
          </section>

          {/* Info / explainer card */}
          <aside className="space-y-4">
            <div
              className="rounded-2xl border bg-[#FDFBF3] p-4 text-sm shadow-sm"
              style={{borderColor:LAFAEK.yellow}}
            >
              <h2 className="text-sm font-semibold mb-1" style={{color:LAFAEK.textDark}}>
                Who can apply?
              </h2>
              <ul className="list-disc pl-4 space-y-1 text-gray-700">
                <li>Government and Catholic schools</li>
                <li>Private schools</li>
                <li>Community learning centres</li>
                <li>NGOs working with children and families</li>
              </ul>
            </div>

            <div
              className="rounded-2xl border bg-white p-4 text-sm shadow-sm"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <h2 className="text-sm font-semibold mb-1" style={{color:LAFAEK.textDark}}>
                How decisions are made
              </h2>
              <p className="text-gray-700 mb-2">
                Lafaek prioritises schools and communities with limited access to books and learning
                materials, especially in rural and remote areas of Timor-Leste.
              </p>
              <p className="text-gray-700">
                Providing clear information in this form helps our team plan printing, logistics, and
                sponsorship support.
              </p>
            </div>

            <div
              className="rounded-2xl border bg-white p-4 text-sm shadow-sm"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <h2 className="text-sm font-semibold mb-1" style={{color:LAFAEK.textDark}}>
                Want to sponsor a school?
              </h2>
              <p className="text-gray-700 mb-2">
                If you are a donor or organisation interested in sponsoring delivery of Lafaek magazines
                to one or more schools, you can also use this form and mention this in your justification.
              </p>
              <Link
                href="/friends"
                className="inline-flex mt-1 text-sm font-semibold underline"
                style={{color:LAFAEK.blue}}
              >
                Learn more about Friends of Lafaek
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
