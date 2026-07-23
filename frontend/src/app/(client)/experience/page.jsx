"use client";

import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { LoadingSpinner,ExperienceCard } from "@/components";
import { customFetch } from "@/utils/customFetch";
import EnquiryForm from "@/components/client/enquiry/EnquiryForm";
import { Grid, List } from "lucide-react";
import  FormModal  from "@/components/shared/FormModal";
import SectionHeader from "@/components/shared/SectionHeader";


export default function DevelopersPage() {
  const { ref, inView } = useInView();
  const [layout, setLayout] = useState("list");
  const [isOpen, setIsOpen] =useState(false)
  const fetchDevelopers = async ({ pageParam = 1 }) => {
    const { data } = await customFetch(`/experience?page=${pageParam}&limit=6`);

    return data;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["experience"],
    queryFn: fetchDevelopers,
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.numOfPages
        ? lastPage.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
 console.log({data})

  return (
    <div className="py-24 min-h-screen">
      {/* <HeroSection /> */}
        <SectionHeader heading="Experience" subHeading="I craft elegant solutions to complex problems through code, design and innovation." title="Experience"></SectionHeader>

      {isOpen && <FormModal onClose={()=>setIsOpen(false)} />}
      
      <div className="container px-4 sm:px-6 lg:px-8">
        {status === "pending" ? (
          <div className="flex justify-center items-center min-h-64">
            <LoadingSpinner />
          </div>
        ) : status === "error" ? (
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 text-red-600">
            <p className="font-medium">Error: {error.message}</p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="relative hidden lg:block  ">
                <EnquiryForm />
              </div>
              <div className="col-span-1 md:col-span-2">
                <div className="relativef md:flex items-center justify-between">
                  <div>
                  </div>
                  <div className="flex gap-4 items-center mb-2">
                  <button onClick={()=>setIsOpen(true)} className="lg:hidden mx-auto mt-2 md:mt-0 px-2 py-1 bg-primary rounded-lg font-bold text-white">Let's Chat</button>
                   <div className="hidden md:flex items-center  gap-4 ">
                       <List
                         onClick={() => {
                           setLayout("list");
                         }}
                         size={30}
                         className="cursor-pointer rounded-xl p-1 
                              transition-all duration-300 ease-in-out 
                              hover:bg-gray-200 hover:scale-105"
                       />
                    <Grid
                      size={30}
                      onClick={() => setLayout("grid")}
                      className="cursor-pointer rounded-xl p-1 
                           transition-all duration-300 ease-in-out 
                           hover:bg-gray-200 hover:scale-105"
                    />
                  </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-in-out">
                  {data.pages.map((page) =>
                    page.experiences.map((experience) => (
                      <div
                        key={experience._id}
                        className={`transform transition-all duration-500 ease-in-out 
                            hover:-translate-y-2
                            ${layout === "grid" ? "md:col-span-1" : "md:col-span-2"}
                            ${
                              layout === "grid"
                                ? "scale-100 opacity-100"
                                : "scale-[0.98] opacity-95"
                            }`}
                      >
                        <ExperienceCard
                          experience={experience}
                          layout={layout}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div ref={ref} className="flex justify-center mt-12 py-4">
              {isFetchingNextPage && <LoadingSpinner />}
            </div>

            {!hasNextPage && data.pages[0].experiences.length > 0 && (
              <div className="text-center">
                <p className="text-gray-500 font-serif italic">
                  No more experiences to load
                </p>
                <div className="mx-auto w-16 h-px bg-gray-300 mt-4"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
