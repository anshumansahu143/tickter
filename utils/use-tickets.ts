import { useQuery, useMutation } from "@tanstack/react-query";

type args = {
  search: string;
  page: number;
  orderby: string;
  order: string;
  per_page: number;
  scope:string;
};
export default function useTicketsList(args: args) {
  return useQuery(
    ["ticketsList", JSON.stringify(args)],
    async () => {
        if(!args.page)return {items:[]};
        let data:any = {};
        let response:any = await fetch(`/api/tickets?args=${JSON.stringify(args)}`);
        if(response.ok){
            response=await response.json();
            data = response?.data;
        }
        return data;
    },
    {
      enabled: !!args,
      staleTime: -1,
    },
  );
}