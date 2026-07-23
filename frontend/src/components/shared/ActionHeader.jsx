import React from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const ActionHeader = ({heading, linkUrl, linkText}) => {
    return (
        <div className="flex justify-between items-center border-b border-gray-600 pb-6 text-white">
        <h1 className="text-3xl font-serif ">{heading}</h1>
        <Link
          href={linkUrl}
          className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span className="font-medium">{linkText}</span>
        </Link>
      </div>
    )
}

export default ActionHeader
