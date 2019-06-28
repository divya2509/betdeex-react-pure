import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux'; // this is for accessing the store\
import { Row, Col } from 'react-bootstrap';

import Navbar from './containers/Navbar/Navbar';
import Sidebar from './containers/Sidebar/Sidebar';
import CreateWallet from './containers/CreateWallet/CreateWallet';
import LoadWallet from './containers/LoadWallet/LoadWallet';
import BetsList from './containers/BetsList/BetsList';
import BetView from './containers/BetView/BetView';

import './App.css';
import { categoryArray, subCategoryArray } from './env.js';

function App(props) {

  // if redux store is empty then try to copy the local storage if there is any data.
  if(Object.entries(props.store.betsMapping).length === 0) {
    const storedBetsMapping = JSON.parse(localStorage.getItem('betdeex-betsMapping') || '{}');
    if(Object.entries(storedBetsMapping).length > 0) {
      props.dispatch({ type: 'LOAD-BETS-MAPPING-FROM-LOCALSTORAGE', payload: storedBetsMapping });
    }
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Row>
          <Col>
            <Sidebar />
          </Col>
          <Col xs="9">
            <Switch>
              <Route path="/create-wallet" exact component={CreateWallet} />
              <Route path="/load-wallet" component={LoadWallet} />
              <Route path="/" exact component={BetsList} />
              <Route path="/bet/:address" exact component={BetView} />
              <Route path="/:category" exact render={props => {
                let categoryWordArray = [];
                for(const categoryWord of props.match.params.category.split('-')) {
                  categoryWordArray.push(categoryWord.charAt(0).toUpperCase() + categoryWord.slice(1));
                }
                const categoryId = categoryArray.indexOf(categoryWordArray.join(' '));

                return <BetsList categoryId={categoryId} />;
              }} />
              <Route path="/:category/:subCategory" exact render={props => {
                let categoryWordArray = [];
                for(const categoryWord of props.match.params.category.split('-')) {
                  categoryWordArray.push(categoryWord.charAt(0).toUpperCase() + categoryWord.slice(1));
                }
                const categoryId = categoryArray.indexOf(categoryWordArray.join(' '));

                let subCategoryWordArray = [];
                for(const subCategoryWord of props.match.params.subCategory.split('-')) {
                  subCategoryWordArray.push(subCategoryWord.charAt(0).toUpperCase() + subCategoryWord.slice(1))
                }
                const subCategoryId = subCategoryArray[categoryId].indexOf(subCategoryWordArray.join(' '));
                return <BetsList categoryId={categoryId} subCategoryId={subCategoryId} />;
              }} />
            </Switch>
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

export default connect(state => {return{store: state}})(App); // this is for accessing the store
//export default App;
