//app/admin/careers/add/page.tsx
"use client";

import {useRouter} from "next/navigation";
import AdminJobForm,{AdminCareerRecord} from "@/components/AdminJobForm";

export default function AddCareerPage(){
  const router=useRouter();

  function handleSaved(record:AdminCareerRecord){
    router.push(`/admin/careers/${record.id}/edit?saved=1`);
  }

  return(
    <AdminJobForm
      mode="add"
      onSaved={handleSaved}
    />
  );
}