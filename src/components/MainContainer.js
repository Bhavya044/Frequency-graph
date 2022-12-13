import React, { useState } from "react";
import axios from "axios";
import MainComponent from "./MainComponent";

const MainContainer = () => {
  const [content, setContent] = useState({});
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);

  //finding occurrence
  const findFrequencyOfWords = (string) => {
    var pattern = /\w+/g,
      wordsMatched = string.match(pattern);
    var counts = wordsMatched.reduce(function (freqMap, word) {
      if (freqMap.hasOwnProperty(word)) {
        freqMap[word] = freqMap[word] + 1;
      } else {
        freqMap[word] = 1;
      }
      return freqMap;
    }, {});
    return counts;
  };

  const formatTop20 = (content) => {
    const labelArray = [];
    const contentArray = [];

    content.forEach((string) => {
      //setting labels and values separately
      string.forEach((item) => {
        if (typeof item === "string") {
          labelArray.push(item);
        }
        if (typeof item === "number") {
          contentArray.push(item);
        }
      });
    });

    setLabels(labelArray);
    setContent(contentArray);
  };

  //fetching the data from api
  const fetchContent = () => {
    setLoading(true);
    axios
      .get("https://www.terriblytinytales.com/test.txt")
      .then(({ data }) => {
        //finding occurrence of each words
        const result = findFrequencyOfWords(data);

        //sorting in descending order
        let sortable = [];
        for (var item in result) {
          sortable.push([item, result[item]]);
        }

        sortable.sort(function (a, b) {
          return b[1] - a[1];
        });

        //picking top 20 results
        const slicedArray = sortable.slice(0, 20);

        //formatting labels and data for graph
        formatTop20(slicedArray);

        setShowHistogram(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <MainComponent
      fetchContent={fetchContent}
      showHistogram={showHistogram}
      labels={labels}
      content={content}
      loading={loading}
    />
  );
};

export default MainContainer;
