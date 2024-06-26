
import logger from './logger'

export function canCopyToClipboard():boolean{
  if (typeof navigator == 'undefined') return false
  if (navigator?.clipboard){
    return true
  }
  return false
}

export async function copyToClipboard(value:string):Promise<boolean> {
  if (canCopyToClipboard()===true){
    try{
      await navigator.clipboard.writeText(value)
      return true
    }catch(e:any){
      logger(`copyToClipboard: ${e?.message}`)
      return false
    }
  }
  return false
}

export default copyToClipboard
