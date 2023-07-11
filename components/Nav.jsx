'use client'
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'

const Nav = () => {
  const {data: session} = useSession()
  const [providers, setProvidera] = useState(null)
  const [toggleMenu, setToggleMenu] = useState(false)

  useEffect(() => {
    const setUpProviders = async () => {
      const res = await getProviders()
      setProvidera(res)
    }

    setUpProviders()
  }, [])

  return (
    <nav className="flex-between w-full pt-5 mb-16">
      <Link href='/' className="flex gap-2 flex-center">
        <Image
          src='/assets/images/logo.svg'
          alt="promptopia logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Gallery</p>
      </Link>

      {/* desktop nav */}
      <div className="sm:flex hidden">
        {session?.user ? (
          <div className="flex gap-3 md:gap-5">
            <button onClick={signOut} className="outline_btn" type="button">Sign Out</button>

            <Link href='/'>
              <Image
                src={session?.user.image}
                className="rounded-full"
                alt='profile'
                width={37}
                height={37}
              />
            </Link>
          </div>)
          :
          (providers &&
          Object.values(providers).map((provider) => (
            <button
              type="button"
              key={provider.name}
              className="black_btn"
              onClick={() => signIn(provider.id)}
            >Sign In</button>
          )))
        }
      </div>

      {/* mobile nav */}
      <div className="sm:hidden flex relative">
        {session?.user ? (
          <div className="flex">
              <Image
                src={session?.user.image}
                className="rounded-full"
                alt='profile'
                width={37}
                height={37}
                onClick={() => {setToggleMenu((prev) => !prev)}}
              />

              {toggleMenu && (
                <div className="dropdown">
                  <button 
                  onClick={() => setToggleMenu((prev) => !prev)}className="mt-5 w-full black_btn" type="button">Sign Out</button>
                </div>
              )}
          </div>)
          :
          (
            providers &&
          Object.values(providers).map((provider) => (
            <button
              type="button"
              key={provider.name}
              className="black_btn"
              onClick={() => signIn(provider.id)}
            >Sign In</button>
          )))
        }
      </div>

    </nav>
  )
}

export default Nav