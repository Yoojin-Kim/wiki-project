// import React from "react";
// import { string, number, array } from "prop-types";
// import { animated, interpolate } from "react-spring/hooks";
// import Carousel from "nuka-carousel";

// /* 이거 안씁니다 */
// /* 이거 안씁니다 */
// /* 이거 안씁니다 */

// const SwipeCard = ({ i, x, y, rot, scale, trans, bind, data }) => {
//   // const { name, age, distance, text, pics } = data[i];
//   const {title, pageid} = data[i]

//   return (
//     <animated.div
//       key={i}
//       style={{
//         transform: interpolate([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`)
//       }}
//     >
//       <animated.div
//         {...bind(i)}
//         style={{
//           transform: interpolate([rot, scale], trans)
//         }}
//       >
//         <div className="card">
//           {/* <Carousel>
//             {pics.map((pic, index) => (
//               <img src={pic} key={index} alt="profilePicture" />
//             ))}
//           </Carousel>
//           <h2>{name},</h2>
//           <h2>{age}</h2>
//           <h5>{distance}</h5>
//           <h5>{text}</h5> */}
//           <h2>{title}</h2>
//         </div>
//       </animated.div>
//     </animated.div>
//   );
// };

// SwipeCard.propTypes = {
//   name: string,
//   age: number,
//   distance: string,
//   text: string,
//   pics: array
// };

// export default SwipeCard;
