/* eslint no-console:0 */
import 'rc-tree/assets/index.css';
import React from 'react';
import PropTypes from 'prop-types';
import Tree, { TreeNode } from 'rc-tree';

const generateData = (x = 3, y = 4, z = 3, gData = []) =>{
    
  function _loop(_level, _preKey, _tns) {
    const preKey = _preKey || '0';
    const tns = _tns || gData;

    const children = [];
    for (let i = 0; i < x; i++) {
      const key = `${preKey}-${i}`;
      tns.push({ title: `${key}-label`, key: `${key}-key` });
      if (i < y) {
        children.push(key);
      }
    }
    if (_level < 0) {
      return tns;
    }
    const __level = _level - 1;
    children.forEach((key, index) => {
      tns[index].children = [];
      return _loop(__level, key, tns[index].children);
    });

    return null;
  }
  _loop(z);
  return gData;
}

class App extends React.Component {
  static propTypes = {
    multiple: PropTypes.bool,
  };
  state = {
    gData: [],
    expandedKeys: [],
    checkedKeys: [],
    checkedKeys1: [],
    selectedKeys: [],
    total: 0,
  };

  componentWillMount() {
    console.time("rctree"); 
}

componentDidMount() {
    console.timeEnd("rctree"); 
}

  componentWillUpdate(nextProps, nextState) {
    // invoked immediately before rendering with new props or state, not for initial 'render'
    // see componentWillReceiveProps if you need to call setState
    // console.log(nextState.gData === this.state.gData);
    if (nextState.gData === this.state.gData) {
      this.notReRender = true;
    } else {
      this.notReRender = false;
    }
  }
  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
    });
  }
  onCheckStrictly = (checkedKeys1, /* extra */) => {
    this.setState({
      checkedKeys1,
    });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info);
    this.setState({
      selectedKeys,
    });
  }
  onGen = (data) => {
    this.setState({
      gData: data,
      expandedKeys: ['0-0-0-key'],
      // checkedKeys: ['0-0-0-0-key', '0-0-1-0-key', '0-1-0-0-key'],
      checkedKeys: ['0-0-0-key'],
      checkedKeys1: ['0-0-0-key'],
      selectedKeys: [],
    });
  }
  calcTotal = (x = 3, y = 2, z = 1) =>{
    /* eslint no-param-reassign:0 */
    const rec = (n) => n >= 0 ? x * (y ** n--) + rec(n) : 0;
    return rec(z + 1);
  }
  loadData200 = () => {
    const temp = generateData(10,5,5);
    const total = this.calcTotal(10,5,5);
    this.setState({data:temp, total:total});
}

  loadData100 = () => {
    const temp = generateData(5,5,5);
    const total = this.calcTotal(5,5,5);
    this.setState({gData:temp, total:total});
  }
  loadData10 = () => {
      const temp = generateData(13,5,3);
      const total = this.calcTotal(13,5,3);
      this.setState({gData:temp, total:total});
  }
  loadData1 = () => {
      const temp = generateData(3,4,3);
      const total = this.calcTotal(3,4,3);
      this.setState({gData:temp, total:total});
  }
 

  render() {
    const loop = data => {
      return data.map((item) => {
        if (item.children) {
          return (<TreeNode key={item.key} title={item.title}>
            {loop(item.children)}
          </TreeNode>);
        }
        return <TreeNode key={item.key} title={item.title}/>;
      });
    };
    // const s = Date.now();
    // const treeNodes = loop(this.state.gDat);
    let treeNodes;
    if (this.treeNodes && this.notReRender) {
      treeNodes = this.treeNodes;
    } else {
      treeNodes = loop(this.state.gData);
      this.treeNodes = treeNodes;
    }
    // console.log(Date.now()-s);
    // <Gen onGen={this.onGen} />
    return (<div style={{ padding: '0 20px' }}>
      
      <div>
        <h3>rctree</h3>
        <button onClick={this.loadData1}>Load 1000</button>
        <button onClick={this.loadData10}>Load 10 000</button>
        <button onClick={this.loadData100}>Load 100 000</button>
        <button onClick={this.loadData200}>Load 200 000</button>
        <p>Total nodes: {this.state.total}</p>
      </div>
      {this.state.gData.length ? <div style={{ display: 'flex' }}>
      <div style={{ marginRight: 20 }}>
          <h3>normal tree</h3>
          <Tree
            multiple={this.props.multiple}
            defaultExpandedKeys={this.state.expandedKeys}
            onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
          >
            {treeNodes}
          </Tree>
        </div>
        
      </div> : null}
    </div>);
  }
}

export default App;