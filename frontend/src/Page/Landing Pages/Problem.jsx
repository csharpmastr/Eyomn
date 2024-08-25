import React from 'react'

const Problem = () => {
  return (
    <div className='h-[100vh] bg-bg-prob2 lg:px-10'>
        <div className=' bg-gradient-to-b from-bg-prob1 to-bg-prob2 rounded-xl'>
            <div className='flex flex-col'>
                <p className='font-Poppins text-[12px] text-paragraph pt-24 text-center'>What's the problem?</p>
                <h2 className='font-Poppins text-[20px] text-Black font-bold tracking-wide pt-5 pb-5 text-center lg:text-[24px]'>What's the problem?</h2>
                <p className='font-Poppins text-[12px] text-paragraph px-6 text-center semi-sm:px-10'>Lorem ipsum dolor sit amet consectetur. Ornare volutpat cursus sed torto dignissim suscipit facilisis volutpat curs Orn.</p>
            </div>
            <div className='flex flex-row justify-center gap-5 mt-5'>
                <div className='px-4 py-2 border-2 rounded-lg  text-lg font-Poppins h-12 bg-white shadow-md'>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
                <div className='px-4 py-2 border-black rounded-lg w-44 text-lg font-Poppins bg-span-bg opacity-50   shadow-md'>
                    <span className=''></span>
                </div>
                <div className='px-4 py-2 border-2 rounded-lg text-lg font-Poppins h-12 bg-white shadow-md'>
                    <p>Lorem ipsum dolor sit amet</p>
                </div>
            </div> 
        </div>
        <div className='mt-16'>
            <div className='pl-5 pr-2'>
                <p className='font-Poppins text-[14px]'>How we solve it? </p>
                <h2 className='font-Poppins text-[20px] text-prob-h font-bold mb-5 mt-3 lg:text-[24px]'>Solve Solve Solve </h2>
                <p className='font-Poppins text-[14px]'>Lorem ipsum dolor sit amet consectetur. Ornare volutpat cursus sed torto dignissim suscipit facilisis volutpat curs Orn.</p>
            </div>
        </div>
    </div>
  )
}

export default Problem