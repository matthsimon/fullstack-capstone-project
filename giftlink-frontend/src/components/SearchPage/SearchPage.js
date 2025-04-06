import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {

    //Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState("");
    const [ageRange, setAgeRange] = useState(6);
    const [searchResults, setSearchResults] = useState([]);
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        const baseUrl = `${urlConfig.backendUrl}/api/search?`;
        const queryParams = new URLSearchParams({
            name: searchQuery,
            age_years: ageRange,
            category: document.getElementById('category').value,
            condition: document.getElementById('condition').value,
        }).toString();

        fetch(`${baseUrl}${queryParams}`)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error("Search failed")
                }
                return resp;
            })
            .then(resp => resp.json())
            .then(data => setSearchResults(data))
            .catch(console.error);
    };

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            <label htmlFor='category'>Category</label>
                            <select id='category' className='form-control'>
                                <option key="all" value="">All</option>
                                {(categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                )))}
                            </select>
                            <label htmlFor='condition'>Condition</label>
                            <select id='condition' className='form-control'>
                                <option key="all" value="">All</option>
                                {(conditions.map((condition) => (
                                    <option key={condition} value={condition}>{condition}</option>
                                )))}
                            </select>
                            <label htmlFor="ageRange">Less than {ageRange} years</label>
                            <input type="range" className="form-range" id="ageRange" min="0" max="10" step="1"
                                value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
                        </div>
                    </div>
                    {/* Task 7: Add text input field for search criteria*/}
                    <input type='text' placeholder='Search for items...' name='query' className='form-control'
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    {/* Task 8: Implement search button with onClick event to trigger search:*/}
                    <button className='btn btn-primary' onClick={handleSearch}>Search</button>
                    {/*Task 5: Display search results and handle empty results with a message. */}
                    {searchResults.length > 0 ? (searchResults.map((gift) => (
                        <div className="row">
                            <div key={gift.id} className="col-md-12">
                                <div className="card product-card">
                                    <img className='card-img-top' style={{height: '200px', objectFit: 'cover'}} src={gift.image} alt={gift.name} />

                                    <div className="card-body">
                                        <h5 className="card-title">{gift.name}</h5>
                                        <p className="card-text">{gift.description.slice(0, 100) + "..."}</p>
                                        <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                            View More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))) : (
                        <div className='mt-2 alert alert-info' role='alert'>
                            No product found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
