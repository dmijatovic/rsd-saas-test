
import {GetServerSidePropsContext} from 'next/types'
import {getRsdSettings} from '~/config/getSettingsServerSide'

export default function Profile() {
  return (
    <h1>Profile redirect</h1>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{

    const {params} = context
    const id = params?.id as string

    // determine active modules
    const {host} = await getRsdSettings()
    // default tab is software
    let tab = ''
    if (host?.modules?.includes('software')){
      tab='software'
    } else if (host?.modules?.includes('projects')){
      tab='projects'
    }
    // if software and projects module are disabled we do not forward
    if (tab===''){
      return {
        notFound: true,
      }
    }
    // redirect to default tab
    return {
      redirect: {
        destination: `/profiles/${id}/${tab}`,
        permanent: false
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
