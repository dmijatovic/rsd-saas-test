// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../types/AutocompleteOptions'
import {OrganisationSource, SearchOrganisation} from '../types/Organisation'
import {createJsonHeaders} from './fetchHelpers'
import {getSlugFromString} from './getSlugFromString'
import logger from './logger'

export async function findInROR({searchFor}:{searchFor:string}) {
  try {
    // this query will match organisation by name or website values
    const url = `https://api.ror.org/organizations?query=${encodeURIComponent(searchFor)}`

    // make request
    const resp = await fetch(url, {
      headers: {
        // pass json request in the header
        ...createJsonHeaders(undefined),
      }
    })

    if (resp.status === 200) {
      const json: any = await resp.json()
      const options = buildAutocompleteOptions(json['items'])
      return options
    }
    logger(`findInROR FAILED: ${resp.status}: ${resp.statusText}`, 'warn')
    // we return nothing
    return []
  } catch (e:any) {
    logger(`findInROR: ${e?.message}`, 'error')
    return []
  }
}

function buildAutocompleteOptions(rorItems: RORItem[]): AutocompleteOption<SearchOrganisation>[] {
  if (typeof rorItems === 'undefined') return []
  if (rorItems.length === 0) return []

  const options = rorItems.map(item => {
    const slug = getSlugFromString(item.name)
    return {
      // we use ror_id as primary key
      key: item?.id ?? slug,
      label: item.name,
      data: {
        id: null,
        parent: null,
        primary_maintainer: null,
        slug,
        name: item.name,
        short_description: null,
        description: null,
        ror_id: item.id,
        website: item.links[0] ?? null,
        is_tenant: false,
        country: item?.country?.country_name ?? null,
        city: item?.addresses[0]?.city ?? null,
        wikipedia_url: item.wikipedia_url ?? null,
        ror_types: item.types ?? [],
        logo_id: null,
        source: 'ROR' as OrganisationSource
      }
    }
  })
  return options
}

// example of ROR item response
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rorItem = {
  'id': 'https://ror.org/008xxew50',
  'name': 'VU Amsterdam',
  'email_address': null,
  'ip_addresses': [],
  'established': 1880,
  'types': [
    'Education'
  ],
  'relationships': [
    {
      'label': 'Amsterdam UMC Location VUmc',
      'type': 'Related',
      'id': 'https://ror.org/00q6h8f30'
    },
    {
      'label': 'Spinoza Centre for Neuroimaging',
      'type': 'Related',
      'id': 'https://ror.org/05kgbsy64'
    },
    {
      'label': 'Advanced Research Center for Nanolithography (Netherlands)',
      'type': 'Child',
      'id': 'https://ror.org/04xe7ws48'
    },
    {
      'label': 'Amsterdam Neuroscience',
      'type': 'Child',
      'id': 'https://ror.org/01x2d9f70'
    },
    {
      'label': 'EMGO Institute for Health and Care Research',
      'type': 'Child',
      'id': 'https://ror.org/0258apj61'
    }
  ],
  'addresses': [
    {
      'lat': 52.333941,
      'lng': 4.865709,
      'state': 'Noord-Holland',
      'state_code': 'NL-NH',
      'city': 'Amsterdam',
      'geonames_city': {
        'id': 2759794,
        'city': 'Amsterdam',
        'geonames_admin1': {
          'name': 'North Holland',
          'id': 2749879,
          'ascii_name': 'North Holland',
          'code': 'NL.07'
        },
        'geonames_admin2': {
          'name': 'Gemeente Amsterdam',
          'id': 2759793,
          'ascii_name': 'Gemeente Amsterdam',
          'code': 'NL.07.0363'
        },
        'license': {
          'attribution': 'Data from geonames.org under a CC-BY 3.0 license',
          'license': 'http://creativecommons.org/licenses/by/3.0/'
        },
        'nuts_level1': {
          'name': 'WEST-NEDERLAND',
          'code': 'NL3'
        },
        'nuts_level2': {
          'name': 'Noord-Holland',
          'code': 'NL32'
        },
        'nuts_level3': {
          'name': 'Groot-Amsterdam',
          'code': 'NL326'
        }
      },
      'postcode': null,
      'primary': false,
      'line': null,
      'country_geonames_id': 2750405
    }
  ],
  'links': [
    'http://www.vu.nl/en/'
  ],
  'aliases': [],
  'acronyms': [
    'VU'
  ],
  'status': 'active',
  'wikipedia_url': 'http://en.wikipedia.org/wiki/VU_University_Amsterdam',
  'labels': [
    {
      'label': 'Vrije Universiteit Amsterdam',
      'iso639': 'nl'
    }
  ],
  'country': {
    'country_name': 'Netherlands',
    'country_code': 'NL'
  },
  'external_ids': {
    'ISNI': {
      'preferred': null,
      'all': [
        '0000 0004 1754 9227'
      ]
    },
    'FundRef': {
      'preferred': null,
      'all': [
        '501100001833'
      ]
    },
    'OrgRef': {
      'preferred': null,
      'all': [
        '324167'
      ]
    },
    'Wikidata': {
      'preferred': null,
      'all': [
        'Q1065414'
      ]
    },
    'GRID': {
      'preferred': 'grid.12380.38',
      'all': 'grid.12380.38'
    }
  }
}

export type RORItem = typeof rorItem
