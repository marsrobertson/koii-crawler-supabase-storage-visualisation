import React, { useState } from 'react';
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
                        <li key={i}>{article}</li>
                      ))}
                    </ol>
                  </td>
                  <td>
                    <ol>
                      {result.most_read.map((article, i) => (
                        <li key={i}>{article}</li>
                      ))}
                    </ol>
                  </td>
                  <td>{result.signature}</td>
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
