import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { PaginatedResult } from "../_model/Pagination.model";

 export function getPaginatedResult<T>(url: string, params: HttpParams, http: HttpClient) {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

  return http.get<T>(url, { observe: 'response', params: params }).pipe(
    map(response => {
      let paginationHeaders = response.headers.get('Pagination');
      if (paginationHeaders) {
        paginatedResult.pagination = JSON.parse(paginationHeaders);
      }
      if(response.body) {
        paginatedResult.result = response.body;
      }
      return paginatedResult;
    })
  );
}

export function getPaginationHeaders(pageNumber: number, pageSize: number){
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return params;
}
