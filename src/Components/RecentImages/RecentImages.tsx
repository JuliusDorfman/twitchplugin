import axios from 'axios';
import React, { useEffect, useState} from 'react';
import './RecentImages.scss';


let api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: baseURL,
  // mode: "cors",
})

export default function RecentImages() {

  const [imageURL, setImageURL] = useState<IrecentImagesResults[]>()

  type RecentImagesList = {
    Data: Data;
  }

  type Data = {
    Contents: Object[];
  }

  type Object = {
    Key: String;
  }

  interface IrecentImagesResults {
    Key: String
  }



  useEffect(() => {
    (() => {
      api.get<RecentImagesList>('/api/getS3URL')
        .then(res => {
          let IrecentImagesResults = res.data.Data.Contents;
          IrecentImagesResults.reverse();
          // console.log(IrecentImagesResults)
          setImageURL(IrecentImagesResults)
          // Object.keys(recentImagesResults).map((image, index) => {
          // let returnRender = IrecentImagesResults.map((image, index) => {
            // console.log(image.Key);
            // setImageURL(image.Key)
            // return (
            //   <li id={`recentImage-${index}`}>
            //     <img src={`https://stateoftwitchart.s3.us-west-1.amazonaws.com/${image.key}`} alt="" />
            //   </li>
            // )
          // })
        }).catch(err => {
          throw err
        })
    })()    
  }, [])


  const handleScrollToTop = (e) => {
    let nestedWindow = document.getElementById('recent-images-component');
    nestedWindow?.scrollTo(0, 0);
  }

  return (
    <section id="recent-images-component">
      <h3 className="recent-images-title">Recently Generated</h3>
      <div className="recent-images-wrapper">
        <ul className="recent-images-list">
          {
            imageURL?.map((image, index) => {
              return (
                <li id={`recentImage-${index}`} key={`recentImage-${index}`} className="recent-image-wrapper">
                  <img src={`https://stateoftwitchart.s3.us-west-1.amazonaws.com/${image.Key}`} alt="" />
                </li>
              )
            })
          }
          <p className="scroll-to-top-recents" onClick={(e) => { handleScrollToTop(e) }}>Back To Top</p>
        </ul>
      </div>
    </section>
  )
}
