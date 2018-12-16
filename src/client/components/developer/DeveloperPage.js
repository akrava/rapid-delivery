import React, { Component } from 'react';
import ResourceCard from './ResourceCard';
import data from './data.json';

class DeveloperPage extends Component {
    render() {
        console.log(data[0].resources[0].success);
        return (
            <React.Fragment>
                <h1>REST API documentation v1</h1>  
                {data && data.map((x, index) => {
                    return (
                        <div className="api mb-1" key={index}>
                            <h2 className="api">{x.title}</h2>
                            {x.resources && x.resources.map((y, index) => {
                                return <ResourceCard 
                                    key={index} 
                                    title={y.title}
                                    url={y.url}
                                    method={y.method}
                                    auth={y.auth}
                                    params={y.params}
                                    data={y.data}
                                    success={y.success}
                                    error={y.error}
                                />;
                            })}
                        </div>
                    );
                })}
            </React.Fragment>
        );
    }
}

export default DeveloperPage;