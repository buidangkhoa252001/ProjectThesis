import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { FcBullish } from 'react-icons/fc'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from './constant'
import { useDispatch } from 'react-redux'
import { Logout } from '../../api/authAPI'
import { IconSocial, IconSocialOff } from '@tabler/icons-react'
import { SiGnusocial } from 'react-icons/si'
import TA from "../../assets/img/TAIMG.jfif"
const linkClass =
	'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

export default function Sidebar() {
		const dispatch = useDispatch()
	const handleLogout = e =>{
        e.preventDefault()
        Logout(dispatch)
        console.log("logout")
    
     

    }
	return (
		<div className="bg-neutral-900 w-60 p-3 flex flex-col">
			<div className="flex items-center justify-center gap-2 px-1 ">
			<img className="text-white text-2xl h-[80px] w-[120px]" src={TA}
                      onClick={() => window.scrollTo({top: 0})}>
                        
                      </img>
			
			{/* 	<span className="text-neutral-200 text-lg">TA Social</span> */}
			</div>
			<div className="py-8 flex flex-1 flex-col gap-0.5">
				{DASHBOARD_SIDEBAR_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))}
			</div>
			<div className="flex flex-col gap-0.5 pt-2 border-t border-neutral-700">
				{DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
					<SidebarLink key={link.key} link={link} />
				))}
				<div  onClick={handleLogout} className={classNames(linkClass, 'cursor-pointer text-red-500')}>
					<span className="text-xl">
						<HiOutlineLogout />
					</span>

					Logout
				</div>
			</div>
		</div>
	)
}

function SidebarLink({ link }) {
	const { pathname } = useLocation()

	return (
		<Link
			to={link.path}
			className={classNames(pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClass)}
		>
			<span className="text-2xl  py-[10px] px-2">{link.icon}</span>
			{link.label}
		</Link>
	)
}
