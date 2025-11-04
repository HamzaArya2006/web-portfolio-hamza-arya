import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen">
      <div id="top" className="relative min-h-[90vh] flex items-center overflow-hidden bg-black text-white">
        <div className="container-pro relative z-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Full-Stack Developer
          </h1>
          <p className="text-xl text-gray-300 mb-8">Building fast, reliable web apps</p>
          <div className="flex gap-4">
            <Link to="/pages/contact" className="btn-primary">Get in touch</Link>
            <Link to="/pages/projects" className="btn-secondary">View projects</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
