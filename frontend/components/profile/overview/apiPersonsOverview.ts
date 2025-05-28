
import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type PersonsOverview = {
  account: string
  display_name: string
  role: string | null
  affiliation: string | null
  avatar_id: string | null
  orcid: string | null
  is_public: boolean
  software_cnt: number | null
  project_cnt: number | null
  keywords: string[] | null
}

type GetPersonsListParams={
  page: number,
  rows: number,
  token?: string
  searchFor?:string,
  orderBy?:string,
}

export async function getPersonsList({page,rows,token,searchFor,orderBy}:GetPersonsListParams){
  try{
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      // search in name and short description
      query+=`&or=(display_name.ilike.*${searchFor}*,affiliation.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=affiliation.asc,display_name.asc'
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/public_persons_overview?${query}`

    // console.log(url)

    // get community
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200,206].includes(resp.status)) {
      const persons: PersonsOverview[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        persons
      }
    }
    logger(`getPersonsList: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      persons: []
    }
  }catch(e:any){
    logger(`getPersonsList: ${e.message}`,'error')
    return {
      count: 0,
      persons: []
    }
  }
}
