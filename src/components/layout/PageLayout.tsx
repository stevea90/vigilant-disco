import Navbar from './Navbar'
import Footer from './Footer'

interface PageLayoutProps {
  children: React.ReactNode
  noFooter?: boolean
}

export default function PageLayout({ children, noFooter }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}
