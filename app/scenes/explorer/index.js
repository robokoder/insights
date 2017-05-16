import './styles.scss'

// libraries
import React, { Component } from 'react'
import { connect } from 'kea/logic'

// utils
import { Layout, LayoutSplitter } from 'react-flex-layout'
import SubmitButton from 'lib/tags/submit-button'

// components
import Graph from './graph'
import TimeFilter from './graph/time-filter'
import Pagination from './pagination'
import Tree from './tree'
import Table from './table'
import Filter from './filter'

// logic
import explorerLogic from '~/scenes/explorer/logic'

@connect({
  actions: [
    explorerLogic, [
      'refreshData',
      'clear'
    ]
  ],
  props: [
    explorerLogic, [
      'graphData',
      'isSubmitting',
      'columns',
      'treeState',
      'filter'
    ]
  ]
})
export default class Explorer extends Component {
  handleClear = () => {
    const { clear } = this.props.actions
    clear()
    this.focusSearch()
  }

  focusSearch = () => {
    const searchNode = document.getElementById('tree-search')
    if (searchNode) {
      searchNode.focus()
    }
  }

  render () {
    const { graphData, isSubmitting, columns, treeState, filter } = this.props
    const { refreshData } = this.props.actions

    return (
      <Layout className='explorer-scene' ref={ref => { this._layout = ref }}>
        <Layout layoutWidth={300}>
          <Tree />
        </Layout>
        <LayoutSplitter />
        <Layout layoutWidth='flex' ref={ref => { this._rightPane = ref }}>
          <Layout layoutHeight={50}>
            <div style={{padding: 10}}>
              <div className='top-controls'>
                {columns.length > 0 || Object.keys(treeState).length > 0 ? (
                  <button onClick={this.handleClear}>
                    Clear
                  </button>
                ) : null}
                {columns.length > 0 ? (
                  <SubmitButton isSubmitting={isSubmitting} onClick={refreshData}>
                    Reload
                  </SubmitButton>
                ) : null}
                {graphData ? (
                  <TimeFilter />
                ) : null}
              </div>
              <div className='top-pagination'>
                <Pagination />
              </div>
            </div>
          </Layout>
          {Object.keys(filter).length > 0 ? (
            <Layout layoutHeight={40}>
              <Filter />
            </Layout>
          ) : <div />}
          {graphData ? (
            <Layout layoutHeight={300}>
              <Graph />
            </Layout>
          ) : <div />}
          {graphData ? <LayoutSplitter /> : <div />}
          <Layout layoutHeight='flex'>
            <Table />
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
