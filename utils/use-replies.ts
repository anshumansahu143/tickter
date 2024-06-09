import { useQuery } from "@tanstack/react-query";


export default function useReplies(id: string) {
  return useQuery(
    ["replies",id],
    async () => {
        if(!id)return {replies:[]};
        let data:any = {};
        let response:any = await fetch(`/api/replies/${id}`);
        
        if(response.ok){
            response=await response.json();
            data = response?.replies;
        }
        return data;
    },
    {
      enabled: !!id,
      staleTime: -1,
    },
  );
}