import { useQuery } from "@tanstack/react-query";


export default function useTicket(id: number) {
  return useQuery(
    ["ticket", id],
    async () => {
        let data:any = {};
        let response:any = await fetch(`/api/ticket/${id}`);
        
        if(response.ok){
            response=await response.json();
            data = response?.ticket;
        }
        return data;
    },
    {
      enabled: !!id,
      staleTime: -1,
    },
  );
}