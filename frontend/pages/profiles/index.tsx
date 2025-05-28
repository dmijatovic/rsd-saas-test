
import {GetServerSidePropsContext} from 'next/types'
import Link from 'next/link'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

import {app} from '~/config/app'
import {getUserSettings} from '~/utils/userSettings'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import PageMeta from '~/components/seo/PageMeta'
import PageBackground from '~/components/layout/PageBackground'
import AppHeader from '~/components/AppHeader'
import MainContent from '~/components/layout/MainContent'
import AppFooter from '~/components/AppFooter'
import SearchInput from '~/components/search/SearchInput'
import useSearchParams from '~/components/search/useSearchParams'
import SelectRows from '~/components/software/overview/search/SelectRows'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {getPersonsList, PersonsOverview} from '~/components/profile/overview/apiPersonsOverview'
import PersonsGrid from '~/components/profile/overview//PersonsGrid'

const pageTitle = `Persons | ${app.title}`
const pageDesc = 'List of persons.'

type PersonsOverviewProps={
  count: number,
  page: number,
  rows: number,
  layout: LayoutType,
  search?: string,
  persons: PersonsOverview[]
}

export default function PersonsOverviewPage({count,page,rows,search,persons}:PersonsOverviewProps) {
  const {handleQueryChange,createUrl} = useSearchParams('profiles')
  const numPages = Math.ceil(count / rows)

  // console.group('PersonsOverviewPage')
  // console.log('count...', count)
  // console.log('layout...', layout)
  // console.log('search...', search)
  // console.log('persons...', persons)
  // console.groupEnd()

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />

      <PageBackground>
        <AppHeader />

        <MainContent className="py-4">
          {/* Page title with search and pagination */}
          <div className="flex flex-wrap py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
            <h1 role="heading" className="mr-4 lg:flex-1">
              Persons
            </h1>
            <div className="flex-2 flex min-w-[20rem]">
              <SearchInput
                placeholder="Search person by name or affiliation"
                onSearch={(search: string) => handleQueryChange('search', search)}
                defaultValue={search ?? ''}
              />
              {/* <ViewToggleGroup
                layout={view}
                onSetView={setLayout}
                sx={{
                  marginLeft:'0.5rem'
                }}
              /> */}
              <SelectRows
                rows={rows}
                handleQueryChange={handleQueryChange}
              />
            </div>
          </div>

          {/* grid is default */}
          <PersonsGrid items={persons}/>

          {/* Pagination */}
          {numPages > 1 &&
            <div className="flex flex-wrap justify-center mb-10">
              <Pagination
                count={numPages}
                page={page}
                renderItem={item => {
                  if (item.page !== null) {
                    return (
                      <Link href={createUrl('page', item.page.toString())}>
                        <PaginationItem {...item}/>
                      </Link>
                    )
                  } else {
                    return (
                      <PaginationItem {...item}/>
                    )
                  }
                }}
              />
            </div>
          }
        </MainContent>

        {/* App footer */}
        <AppFooter />
      </PageBackground >
    </>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {req} = context
    const {search, rows, page} = ssrBasicParams(context.query)
    const token = req?.cookies['rsd_token']

    // extract user settings from cookie
    const {rsd_page_layout,rsd_page_rows} = getUserSettings(context.req)
    // use url param if present else user settings
    const page_rows = rows ?? rsd_page_rows

    // get news items list to all pages server side
    const {count,persons} = await getPersonsList({
      // api uses 0 based index
      page: page>0 ? page-1 : 0,
      rows: page_rows,
      searchFor: search,
      // orderBy: 'software_cnt.desc',
      token
    })

    return {
      // passed to the page component as props
      props: {
        search,
        count,
        page,
        rows: page_rows,
        layout: rsd_page_layout,
        persons,
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
