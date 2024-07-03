import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SupabaseQuery = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState('');

  const executeQuery = async () => {
    const filterConditions = query.split(' ').filter(Boolean);
    let supabaseQuery = supabase.from('submissions').select('*');

    for (let i = 0; i < filterConditions.length; i += 3) {
      const column = filterConditions[i];
      const operator = filterConditions[i + 1];
      let value = filterConditions[i + 2];

      console.log(column + " | " + operator + " | " + value);

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
      setResults(`Error: ${error.message}`);
    } else {
      setResults(JSON.stringify(data, null, 2));
    }
  };

  return (
    <div>
      <h1>Task Query Interface</h1>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your filter condition here..."
      />
      <button onClick={executeQuery}>Execute Query</button>
      <div id="results" style={{ whiteSpace: 'pre-line', border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
        {results}
      </div>
    </div>
  );
};

export default SupabaseQuery;
