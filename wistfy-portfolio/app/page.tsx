import { SystemProvider } from '@/app/system/SystemProvider'
import Experience from '@/app/components/Experience'

export default function Home() {
  return (
    <SystemProvider>
      <Experience />
    </SystemProvider>
  )
}