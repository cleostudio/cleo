import {
  citiesPageMetadata,
  CitiesPageView,
} from '../../_views/cities-page'

export const metadata = citiesPageMetadata()

export default function CitiesPage() {
  return <CitiesPageView />
}
