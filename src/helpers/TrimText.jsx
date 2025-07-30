import React from 'react'

const TrimText = ({item, maxLength}) => {
  return (
   <>
   {item?.lenght > maxLength ? item?.substring(0, maxLength)+ "..." : item}
   </>
  )
}

export default TrimText