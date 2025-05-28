// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import SoftwareMetrics from '../cards/SoftwareMetrics'
import {getImgUrl} from '../useSoftwareOverviewProps'

type SoftwareOverviewListItemProps = {
  brand_name: string
  short_statement: string
  image_id: string | null
  contributor_cnt: number | null
  mention_cnt: number | null
  is_published: boolean
  downloads?: number
  statusBanner?: JSX.Element
  domain?: string|null
}

export default function SoftwareListItemContent(item:SoftwareOverviewListItemProps) {
  const imgUrl = getImgUrl({domain:item.domain,image_id:item.image_id})

  return (
    <>
      <ListImageWithGradientPlaceholder
        imgSrc={imgUrl}
        alt = {`Cover image for ${item.brand_name}`}
      />
      <div className="flex flex-col md:flex-row gap-3 flex-1 py-2">
        <div className="flex-1">
          <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
            {item.brand_name}
          </div>
          <div className='line-clamp-3 md:line-clamp-1 break-words text-sm text-base-content-secondary'>
            {item.short_statement}
          </div>
          {/* project status - admin only */}
          {item.statusBanner &&
            <div className="flex gap-2 text-xs opacity-70">
              {item.statusBanner}
            </div>
          }
        </div>
        <div className="flex items-center gap-4">
          {/* Metrics */}
          <SoftwareMetrics
            contributor_cnt={item.contributor_cnt ?? 0}
            mention_cnt={item.mention_cnt ?? 0}
            downloads={item.downloads}
          />
        </div>
      </div>
    </>
  )
}
