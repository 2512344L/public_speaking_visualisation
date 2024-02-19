import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const WordCloud = ({ words }) => {
  const ref = useRef();
  const wordsArray = typeof words === 'string' ? words.split(',') : words;


  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove(); // 清除之前的词云
    // 设置词云的尺寸
    const width = 400;
    const height = 300;

    const wordCloud = cloud()
      .size([width, height])
      .words(wordsArray.map(word => ({ text: word, size: 18 }))) // 设置统一的字体大小
      .padding(5) // 可以调整以适应您的设计
      .rotate(0) // 保持单词水平
      .font('Impact')
      .fontSize(d => d.size)
      .on('end', draw);

    wordCloud.start();

    function draw(words) {
      const svg = d3.select(ref.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      svg.selectAll('text')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style("font-weight", "normal")
        .style("fill", "grey")
        .attr('text-anchor', 'middle') // 中心对齐文本
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .text(d => d.text);
    }
  }, [words]); // 当 words 更新时重新生成词云

  return <svg ref={ref} />;
};

export default WordCloud;

