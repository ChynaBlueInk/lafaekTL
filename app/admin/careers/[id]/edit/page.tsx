//app/admin/careers/add/page.tsx
"use client";

import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import AdminJobForm,{AdminCareerRecord} from "@/components/AdminJobForm";
import {Loader2,TriangleAlert} from "lucide-react";

type ApiResponse={
  ok:boolean;
  record?:AdminCareerRecord;
  error?:string;
};

export default function EditCareerPage(){
  const params=useParams<{id:string}>();
  const id=typeof params?.id==="string"?params.id:"";

  const [record,setRecord]=useState<AdminCareerRecord|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    let cancelled=false;

    async function loadRecord(){
      if(!id){
        setError("Missing career ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try{
        const response=await fetch(`/api/admin/careers/${id}`,{
          method:"GET",
          cache:"no-store",
        });

        const data=(await response.json()) as ApiResponse;

        if(!response.ok||!data.ok||!data.record){
          throw new Error(data.error||"Failed to load career record.");
        }

        if(!cancelled){
          setRecord(data.record);
        }
      }catch(error:any){
        if(!cancelled){
          setError(error?.message||"Failed to load career record.");
        }
      }finally{
        if(!cancelled){
          setLoading(false);
        }
      }
    }

    loadRecord();

    return()=>{
      cancelled=true;
    };
  },[id]);

  if(loading){
    return(
      <div className="min-h-screen bg-[#F5F5F5] px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#219653]" />
          <p className="mt-4 text-[#4F4F4F]">Loading career record...</p>
        </div>
      </div>
    );
  }

  if(error||!record){
    return(
      <div className="min-h-screen bg-[#F5F5F5] px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#EB5757] bg-[#FFF1F1] p-8 shadow-sm">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 text-[#EB5757]" />
            <div>
              <p className="font-semibold text-[#B42318]">Unable to load job</p>
              <p className="mt-1 text-sm text-[#B42318]">{error||"Career record not found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <AdminJobForm
      mode="edit"
      initialData={record}
      onSaved={setRecord}
    />
  );
}