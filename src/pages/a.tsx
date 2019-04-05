import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const a = () => (
  <Query query={gql(query)}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) {
        console.error(error.message);
        return null;
      }

      const list = data.categoriesCollection.items.slice(0, 10);

      return (
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item.medicalConditionName}</li>
          ))}
        </ul>
      );
    }}
  </Query>
);

const query = `{
    categoriesCollection {
        items {
        medicalConditionName
      }
    }
  }`;

export default a;
