import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'

export function PhotosPageView() {
  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="page-eyebrow enter">
          <T zh="照片" en="Photos" />
        </h1>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>
      <p className="enter mt-10 text-sm text-muted-foreground">
        <T zh="暂无照片。" en="No photos yet." />
      </p>
    </div>
  )
}
