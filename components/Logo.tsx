import Link from "next/link"
import Image from 'next/image';


const Logo = () => {
  return (
    <div className="flex items-center pr-25">
      <span className="text-2xl font-bold text-black tracking-wider"><Link href="/"><Image src="/images/logo_wine.png" alt="Logo" width={100} height={50} /></Link></span>
    </div>
  )
}

export default Logo