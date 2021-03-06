import React, { useEffect, useState, useContext } from "react";
import { auth } from '../../firebase';
import "../../App.css";
import {PullCard} from '../../components';
import {useHistory } from "react-router-dom";

import * as colors from '../../data/constants';

import axios from 'axios';

// import cardData from '../../data/cardData';
import { Name } from '../../data/images/index';
import './game.css';

import { direction } from 'react-deck-swiper';

import { UserContext } from "../../providers/UserProvider";

import { Row, Col } from 'react-bootstrap';

const CATEGORY_NUM = 5;

const GameCardPage = () => {
  const { language } = useContext(UserContext);

  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedPage, setSelectedPage] = useState([]);

  const [showMainCategory, setShowMainCategory] = useState([]);
  const [showPageCategory, setShowPageCategory] = useState([]);

  const [cardIndex, setCardIndex] = useState(0);
  const [tempCategory, setTempCategory] = useState(null);


  const [tempPageNum, setTempPageNum] = useState()
  const [score, setScore] = useState(0)

  // wiki api 요청하는 기본 url
  const base_url = `https://${language}.wikipedia.org/w/api.php?`;


  // 이전에 선택한 카테고리와 겹치는 페이지만 새로 저장하는 함수
  const filterPage = (pages) => {
    

    // 처음엔 비교 안하고 새로 저장함
    if(selectedCategory.length <= 1 && selectedPage.length === 0) {
        // console.log('if pages' , pages)
        setSelectedPage(pages);

        setTempPageNum(pages.length);

        // 속한 페이지들 각각의 카테고리들을 구함
        pages.map((item, index) => {
          searchPageCategory(item.title)
        })
    }
    else {
      // console.log('else pages' , pages)
      const list = []
      for(let i=0; i<pages.length; i++){
        for(let j=0; j<selectedPage.length; j++){
          // console.log(selectedPage[j].pageid)
          if (pages[i].pageid === selectedPage[j].pageid) list.push(pages[i])
        }
      }
      // console.log('filtered selected page', list);
      setSelectedPage(list);

      var tempScore = score;
      var offset = selectedCategory.length;

      tempScore += offset * 10 * (tempPageNum - list.length);
      setScore(tempScore);
      setTempPageNum(list.length)
      // console.log('score: ', tempScore);

      // 속한 페이지들 각각의 카테고리들을 구함
      list.map((item, index) => {
          searchPageCategory(item.title);
      })
      
      // 5개 고르면 자동 종료
      // 마지막 선택까지 selectedPage에 반영되게
      if (selectedCategory.length === CATEGORY_NUM) handleFinish({finishResult: list})
    }
  }


  // 해당 카테고리의 페이지 정보를 불러오는 함수
  const searchPage = async (categoryQuery) => {

      const categoryPage_url = `action=query&format=json&list=categorymembers&origin=*&cmtitle=Category:${categoryQuery}&cmlimit=1000`

      // console.log('categoryQuery', categoryQuery)
      try {
        // 두번째엔 이거 데이터가 안 옴 -> "분류 :" 글자 때문
        const { data } = await axios.get(`${base_url}${categoryPage_url}`);
        let pages = data.query.categorymembers
        filterPage(pages)
        // console.log('search page result', pages);
      } catch (e) {
        // console.log(e)
      }
  }


  // 위키피디아의 모든 카테고리를 불러오는 함수
  const searchAllCategory = async () => {
    /* 중간에 &origin=* 이거 반드시 넣어야 cors 안 막힘 */

    // 200페이지 정도면 괜찮다
    // 500개까지만 옴
    const category_url = `action=query&format=json&list=allcategories&origin=*&acmax=400&aclimit=500&acmin=200`

    try {
    const { data } = await axios.get(`${base_url}${category_url}`);
    let list = data.query.allcategories

    // 객체 형태로 옴
    // console.log('list :', list)
    for (let i=0; i < list.length; i ++) {
        let categoryData = showMainCategory;
        for(let key in list[i]){
            let value = list[i][key];
            categoryData.push(value);
            // 문자열 리스트로 바꿔서 저장
            
        }
        setShowMainCategory(categoryData)
        var min = Math.ceil(0);
        var max = Math.floor(30);
        var random = Math.floor(Math.random() * (max-min)) + min;
        i += random;
    }
    // console.log('showMainCategory : ', showMainCategory)

    // 첫 카드가 안 나와서 강제로 하나 넘김
    // handleOnSwipe(direction.LEFT);
    } catch (e) {
        // console.log(e)
      }

    // ... 랜덤으로 카테고리 선택하는 로직 필요
  }


  // 해당 페이지의 카테고리를 불러오는 함수
  const searchPageCategory = async (pageQuery) => {
    const pageCategory_url = `action=query&format=json&origin=*&titles=${pageQuery}&prop=categories`

    try {
    const result = await axios.get(`${base_url}${pageCategory_url}`);
    const data = result.data.query.pages
    let item = []
    // console.log('pageCategory data: ', data)
    
    for(let key in data){
            item = data[key].categories
            // console.log('pageCategory: title', item)
    }
    let list = showPageCategory

    item.map((d, index) => {
      // 카테고리 앞에 "분류 :" 라는 글자가 붙으면 페이지 검색이 안됨!!!! 
      // 한국어일 경우
      if (d.title[2] === ':') list.push(d.title.slice(3))
      // 영어일 경우
      else if (d.title[8] === ':') list.push(d.title.slice(9))
      else list.push(d.title)
    })

    setShowPageCategory(list)
    setShowMainCategory(list)
    } catch (e) {
        // console.log(e)
      }
  }

  useEffect(() => {
    if (selectedCategory.length > 1 && cardIndex >= (showPageCategory.length -1)) {
      // console.log('re')
      searchAllCategory();
      setCardIndex(0);
      setShowMainCategory([]);
      setShowPageCategory([]);
    } else if ( cardIndex !== 0 && selectedCategory.length === 0 && cardIndex >= (showMainCategory.length - 1)) {
      // console.log('new')
      searchAllCategory();
      setCardIndex(0);
      setShowMainCategory([]);
      setShowPageCategory([]);
    }
  }, [showPageCategory, cardIndex])


  useEffect(() => {
    // 마운트시 카테고리 불러옴
    searchAllCategory();
  }, [])

  

  const handleOnSwipe = (swipeDirection) => {
    // for card index reset
    // let cI = cardIndex;
    // console.log('card', cardIndex);
    
    if (swipeDirection === direction.RIGHT) {
      // handle right swipe

      // 인덱스 테스트 더 필요함
      const item = showMainCategory[cardIndex]

      // card index reset
      // setCardIndex(0);
      // cI = 0;


      let list = selectedCategory
      
      list.push(item)
      searchPage(item)
      setSelectedCategory(list)

      // 일시적으로 비워서 빈 카드로 보이게 하기 위함
      setShowMainCategory([])
      
      // console.log('selected category: ', list)
    }

    if (swipeDirection === direction.LEFT) {
      // handle left swipe
      // console.log('pass')
    }

    // let list = selectedCategory
    // list.pop()
    // console.log(list);
    // setSelectedCategory(list);

    let index = cardIndex + 1;
    setCardIndex(index);
    // console.log('cardIndex: ', index)
  }

  const handleFinish = ({ finishScore, finishResult }) => {
    history.push({pathname: '/result', state: { result: finishResult !== undefined ? finishResult : selectedPage, category: selectedCategory, score: finishScore !== undefined ? finishScore : score }})
  }

  // useEffect(() => {
  //   // 5개 고르면 자동 종료
  //   if (selectedCategory.length === 5) handleFinish()
  // }, [selectedCategory, handleFinish])

  useEffect(() => {
    // result가 0이면 자동 종료
    if (selectedCategory.length > 1 && selectedPage.length === 0) {
      setScore(0);
      handleFinish({finishScore: 0});
    } 
  }, [selectedPage, handleFinish])


  useEffect(() => {
    auth.onAuthStateChanged(function(userData){
    if(userData){
      if(localStorage.getItem('tutorial') === null) history.push('/tutorial');
     //  else console.log('tutorial', localStorage.getItem('tutorial'))
    } else {
      alert('로그인이 필요합니다.');
      history.push({pathname: '/login', state: { go: `game/${language}` }});
    }

    return () => {
      setSelectedCategory([]);
    }
  });
  }, [])


  

  return (
    <div className='game-back'>
       {/* 스크롤 불가능하게 막았다 */}
        <div className="game-background">
          <div className="game-top-gradation" />
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <Name className="click" onClick={() => history.push('/')} />
            </div> 
            <div className="line" style={{marginTop: 8}} />

            <div className="game-result">
               <div className="result-column">
                 <div className="LeftSDPink f12" 
                  style={{
                    width: '30%', display: 'flex', justifyContent: 'center', textAlign: 'center'
                  }}>
                    Flipped Cards
                 </div>
                 <div className="VPink f32" style={{width: '50%', textAlign: 'left', marginLeft: 17}}>
                    {selectedCategory.length}/{CATEGORY_NUM}
                 </div>
               </div>

                <div style={{width: 1, height: '100%', backgroundColor: colors.pink, marginLeft: 8, marginRight: 8}} />
                
                <div className="result-column">
                 <div className="LeftSDPink f12"
                 style={{
                    width: '30%', display: 'flex', justifyContent: 'center', textAlign: 'center'
                  }}>
                    Results Now
                 </div>
                 <div className="VPink f32" style={{width: '50%', textAlign: 'left', marginLeft: 17}}>
                    {selectedPage.length}
                 </div>
               </div>
            </div>
            <div className="line" />

              <div className="card-back">
                    <PullCard 
                      category={showMainCategory[cardIndex]} 
                      handlePick={() => handleOnSwipe(direction.RIGHT)} 
                      handlePass={() => handleOnSwipe(direction.LEFT)}
                      setTempCategory={setTempCategory}
                      language={language}
                    />
                </div>


            <div style={{display: 'flex', width: '100%', marginTop: 24, flexDirection: 'column'}}>
              <Row>
              {tempCategory !== null && 
                    <Col xs={6} xl={6}>
                      <div className="semi-box">
                                {/* tempCategory */}
                      </div>
                    </Col>
                }
                {selectedCategory.map((item, index) => {
                    return(
                      <Col xs={6} xl={6}>
                        <div className="category-box">
                            <div className="SDGreen f12">
                                {selectedCategory[selectedCategory.length - 1 - index].length > 13
                                ?
                                  `${selectedCategory[selectedCategory.length - 1 - index].slice(0, 14)} …`
                                : 
                                  selectedCategory[selectedCategory.length - 1 - index]
                                }
                            </div>
                        </div>
                      </Col>
                    )
                })}
                </Row>
            </div>
            
        </div>

          {/* <div className="game-pc-floating">
            <div className="game-floating" style={{justifyContent: 'space-between'}}>
                <div className="styled-btn"
                onClick={()=>{handleOnSwipe(direction.LEFT)}}
                style={{backgroundColor: colors.green, marginRight: 8}}>
                    <Text size={24} color={'pink'}>Pass</Text>
                </div>
                <div className="styled-btn"
                onClick={()=>{handleOnSwipe(direction.RIGHT)}}
                style={{backgroundColor: colors.pink, marginLeft: 8}}>
                    <Text size={24} color={'green'}>Flip</Text>
                </div>
            </div>
          </div> */}

    </div>
    );
};

export default GameCardPage;
