import { useQuery, useMutation } from "@tanstack/react-query";


export default function useTicketsList(id: number) {
  return useQuery(
    ["ticket", id],
    async () => {
        if(!id)return {ticket:{}};
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