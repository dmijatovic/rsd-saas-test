import {useState,useEffect} from 'react'
import {useAuth} from '.'

import PageErrorMessage from '../components/layout/PageErrorMessage'
import ContentLoader from '../components/layout/ContentLoader'
import {isMaintainerOfSoftware} from '../utils/editSoftware'
import logger from '../utils/logger'

/**
 * Wrap the content you want to protect in this component.
 * For editing page content (eg. software page) only authenticated MAINTAINERS
 * are allowed to access the content. Components uses isMaintainerOfSoftware
 * to validate if current user is authenticated AND the maintainer of content,
 * based on page slug. NOTE! Slug is optional prop and if not provided the
 * maintainer validation is not performed.
 */
export default function ProtectedContent({children, slug}: { children: any, slug?: string }) {
  const {session} = useAuth()
  // keep maintainer flag
  const [isMaintainer, setIsMaintainer] = useState(false)
  // if slug is provided we need to make api call to check if user
  // is maintainer of the software
  const [status, setStatus] = useState(slug ? 'loading' : session?.status)

  useEffect(() => {
    let abort = false
    if (slug && session.token) {
      setStatus('loading')
      // validate if user is maintainer
      // of this software
      isMaintainerOfSoftware({
        slug,
        account: session?.user?.account ?? '',
        token: session?.token
      }).then(resp => {
        // stop on abort
        if (abort) return
        // update states
        setIsMaintainer(resp)
        setStatus(session.status)
      })
    } else if (session?.status) {
      setStatus(session.status)
    }
    return () => { abort = true }
  }, [slug, session.token, session?.user?.account, session.status])

  // return nothing
  if (status === 'loading') return <ContentLoader />

  // authenticated user not on 'protected' section
  if (status === 'authenticated' && !slug) {
    // logger('ProtectedContent...authenticated user...not protected section', 'info')
    return children
  }

  // isMaintainer of software and is authenticated
  if (status === 'authenticated' && slug && isMaintainer) {
    // logger(`ProtectedContent...authenticated user...maintainer of ${slug}`, 'info')
    return children
  }

  // not authenticated
  if (status !== 'authenticated') {
    return (
      <PageErrorMessage
        status={401}
        message='UNAUTHORIZED'
      />
    )
  }

  // authenticated but not maintainer = 403
  return (
    <PageErrorMessage
      status={403}
      message='FORBIDDEN'
    />
  )
}
