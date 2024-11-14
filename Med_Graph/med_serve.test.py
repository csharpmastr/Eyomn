def test_invalid_api_key():
    from fastapi.testclient import TestClient
    from med_serve import serve_llm

    app = serve_llm()
    client = TestClient(app)

    response = client.post(
        "/completions",
        json={"prompt": "What is the capital of France?"},
        headers={"Authorization": "Bearer invalid_token"},
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid authentication credentials"}
    

def test_empty_input_and_invalid_model_config():
    from fastapi.testclient import TestClient
    from med_serve import serve_llm

    # Test with empty input
    app = serve_llm()
    client = TestClient(app)
    response = client.post("/completions", json={"prompt": ""}, headers={"Authorization": "Bearer valid_token"})
    assert response.status_code == 400
    assert response.json() == {"detail": "Prompt cannot be empty"}

    # Test with invalid model configuration
    app.state.engine_client = None  # Simulate invalid model configuration
    response = client.post("/completions", json={"prompt": "What is the capital of France?"}, headers={"Authorization": "Bearer valid_token"})
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}

def test_non_existent_endpoint():
    from fastapi.testclient import TestClient
    from med_serve import serve_llm

    app = serve_llm()
    client = TestClient(app)

    response = client.get("/non_existent_endpoint")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not Found"}