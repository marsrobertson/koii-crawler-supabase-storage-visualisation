import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseQuery = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const executeQuery = async () => {
    const filterConditions = query.split(' ').filter(Boolean);
    let supabaseQuery = supabase.from('submissions').select('*');

    for (let i = 0; i < filterConditions.length; i += 3) {
      const column = filterConditions[i];
      const operator = filterConditions[i + 1];
      let value = filterConditions[i + 2];

      if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }

      switch (operator) {
        case '=':
          supabaseQuery = supabaseQuery.eq(column, value);
          break;
        case '!=':
          supabaseQuery = supabaseQuery.neq(column, value);
          break;
        case '>':
          supabaseQuery = supabaseQuery.gt(column, value);
          break;
        case '>=':
          supabaseQuery = supabaseQuery.gte(column, value);
          break;
        case '<':
          supabaseQuery = supabaseQuery.lt(column, value);
          break;
        case '<=':
          supabaseQuery = supabaseQuery.lte(column, value);
          break;
        case 'like':
          supabaseQuery = supabaseQuery.like(column, value);
          break;
        default:
          console.error(`Unsupported operator: ${operator}`);
      }
    }

    const { data, error } = await supabaseQuery;
    if (error) {
      setResults([{ error: error.message }]);
    } else {
      setResults(data);
    }
  };

  useEffect(() => {
    executeQuery(query);
  }, []); // Empty dependency array ensures this runs only once on initial load

  return (
    <div>
      <h1>Explorer</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your filter condition here..."
        rows="4"
        cols="60"
      />
      <br/>
      <button onClick={executeQuery}>Execute Query</button>
      <div id="results" style={{ whiteSpace: 'pre-line', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {results.length > 0 && (
          <table>
            <thead>
              <tr>
                <th style={{ width: "4%"}}>id</th>
                <th style={{ width: "10%"}}>node_id</th>
                <th style={{ width: "10%"}}>round_id</th>
                <th style={{ width: "30%"}}>most viewed</th>
                <th style={{ width: "30%"}}>most read</th>
                <th style={{ width: "13%"}}>signature</th>
                <th style={{ width: "13%"}}>timestamp</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.id}</td>
                  <td>{result.node_id}</td>
                  <td>{result.round_id}</td>
                  <td>
                    <ol>
                      {result.most_viewed.map((article, i) => (
                        <li key={i}>{article}
                          { result.most_viewed_link && result.most_viewed_link[i] &&
                            <a href={result.most_viewed_link[i]}>
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Interface / External_Link"><path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                            </a>
                          }
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td>
                    <ol>
                      {result.most_read.map((article, i) => (
                        <li key={i}>{article}
                          { result.most_read_link && result.most_read_link[i] &&
                            <a href={result.most_read_link[i]}>
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="Interface / External_Link"><path id="Vector" d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
                            </a>
                          }
                        </li>
                      ))}
                    </ol>
                  </td>
                  <td>{result.signature.length > 400 ? result.signature.substring(0, 400) + '...' : result.signature}</td>
                  <td>{new Date(result.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {results.length === 0 && <p>No results found</p>}
      </div>
    </div>
  );
};

export default SupabaseQuery;
