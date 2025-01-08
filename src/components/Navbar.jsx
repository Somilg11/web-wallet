import { Wallet } from "lucide-react"


const Navbar = () => {
  return (
    <div>
        <nav className="flex justify-between items-center py-5">
            <div className="text-4xl font-semibold tracking-tighter">
                <span className="inline-flex gap-2 items-end"><Wallet size={32}/>Wallet</span>
            </div>
        </nav>
    </div>
  )
}

export default Navbar