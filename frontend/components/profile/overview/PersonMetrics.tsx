// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tooltip from '@mui/material/Tooltip'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'

type PersonMetricsProps = {
  software_cnt: number | null
  project_cnt: number | null
}

export default function PersonMetrics({software_cnt,project_cnt}:PersonMetricsProps) {

  function softwareMessage(){
    if (software_cnt && software_cnt === 1) {
      return `${software_cnt} software package`
    }
    return `${software_cnt ?? 0} software packages`
  }

  function projectMessage(){
    if (project_cnt && project_cnt === 1) {
      return `${project_cnt} research project`
    }
    return `${project_cnt ?? 0} research projects`
  }

  return (
    <>
      <Tooltip title={softwareMessage()} placement="top">
        <div className="flex gap-2 items-center text-base-content-secondary">
          <TerminalIcon sx={{width:20}} />
          <span className="text-sm">{software_cnt ?? 0}</span>
        </div>
      </Tooltip>
      {
        project_cnt !== null &&
        <Tooltip title={projectMessage()} placement="top">
          <div className="flex gap-2 items-center text-base-content-secondary">
            <ListAltIcon sx={{width:20}} />
            <span className="text-sm">{project_cnt}</span>
          </div>
        </Tooltip>
      }
    </>
  )
}
