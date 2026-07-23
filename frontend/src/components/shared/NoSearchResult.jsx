import React from 'react'
import { Briefcase } from 'lucide-react'

const NoSearchResult = ({heading}) => {
    return (
        <div className="text-center py-16 rounded-lg border border-dashed border-gray-700">
        <Briefcase size={36} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500 mb-2">
          {heading}
        </p>
        <p className="text-sm text-gray-400">
          Try a different search or check back later.
        </p>
      </div>
    )
}

export default NoSearchResult
