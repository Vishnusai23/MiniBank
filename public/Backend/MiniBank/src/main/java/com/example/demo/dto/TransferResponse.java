package com.example.demo.dto;

public class TransferResponse {

    private String status;
    private String remarks;

    // ✅ Required by Jackson
    public TransferResponse() {
    }

    public TransferResponse(String status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public String getStatus() {
        return status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
