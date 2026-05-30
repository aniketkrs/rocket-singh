import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { CompanyProfile } from '../types';
import './Onboarding.css';

const Onboarding: React.FC = () => {
  const { companyProfile, updateCompanyProfile, addToast } = useApp();
  const [form, setForm] = useState<CompanyProfile>(companyProfile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(companyProfile);
  }, [companyProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleNegoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      negotiationRules: {
        ...prev.negotiationRules,
        [name]: Number(value),
      },
    }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(form);
    addToast('Company profile saved! ✅', 'success');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="onboarding">
      <div className="onboarding__header">
        <h1 className="onboarding__title">
          🏢 Company Profile
        </h1>
        {saved && (
          <span className="onboarding__saved">
            ✓ Saved
          </span>
        )}
      </div>

      <div className="onboarding__body">
        <form className="onboarding__form" onSubmit={handleSave}>
          {/* Basic Info */}
          <div className="onboarding__section">
            <div className="onboarding__section-header">
              <span className="onboarding__section-icon">📋</span>
              <span className="onboarding__section-title">Basic Information</span>
            </div>
            <div className="onboarding__section-body">
              <div className="onboarding__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-name">Company Name</label>
                  <input
                    id="onb-name"
                    className="input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-website">Website</label>
                  <input
                    id="onb-website"
                    className="input"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://acme.com"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="onb-product">Product Description</label>
                <textarea
                  id="onb-product"
                  className="textarea"
                  name="productDescription"
                  value={form.productDescription}
                  onChange={handleChange}
                  placeholder="Describe your product or service…"
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="onb-icp">Ideal Customer Profile</label>
                <textarea
                  id="onb-icp"
                  className="textarea"
                  name="idealCustomerProfile"
                  value={form.idealCustomerProfile}
                  onChange={handleChange}
                  placeholder="Describe your ideal customer…"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Pricing & Assets */}
          <div className="onboarding__section">
            <div className="onboarding__section-header">
              <span className="onboarding__section-icon">💰</span>
              <span className="onboarding__section-title">Pricing & Assets</span>
            </div>
            <div className="onboarding__section-body">
              <div className="form-group">
                <label className="form-label" htmlFor="onb-pricing">Pricing Details</label>
                <textarea
                  id="onb-pricing"
                  className="textarea"
                  name="pricingDetails"
                  value={form.pricingDetails}
                  onChange={handleChange}
                  placeholder="e.g. Starter $29/mo, Pro $99/mo…"
                  rows={2}
                />
              </div>
              <div className="onboarding__row">
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-demo-url">Demo Video URL</label>
                  <input
                    id="onb-demo-url"
                    className="input"
                    name="demoVideoUrl"
                    value={form.demoVideoUrl}
                    onChange={handleChange}
                    placeholder="https://youtube.com/…"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-booking-url">Booking Calendar URL</label>
                  <input
                    id="onb-booking-url"
                    className="input"
                    name="bookingCalendarUrl"
                    value={form.bookingCalendarUrl}
                    onChange={handleChange}
                    placeholder="https://calendly.com/…"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="onb-payment-url">Payment URL</label>
                <input
                  id="onb-payment-url"
                  className="input"
                  name="paymentUrl"
                  value={form.paymentUrl}
                  onChange={handleChange}
                  placeholder="https://stripe.com/pay/…"
                />
              </div>
            </div>
          </div>

          {/* Negotiation Rules */}
          <div className="onboarding__section">
            <div className="onboarding__section-header">
              <span className="onboarding__section-icon">🤝</span>
              <span className="onboarding__section-title">Negotiation Rules</span>
            </div>
            <div className="onboarding__section-body">
              <div className="onboarding__row--3">
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-max-discount">Max Discount %</label>
                  <input
                    id="onb-max-discount"
                    className="input"
                    type="number"
                    name="maxDiscountPercent"
                    value={form.negotiationRules.maxDiscountPercent}
                    onChange={handleNegoChange}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-trial-days">Trial Days</label>
                  <input
                    id="onb-trial-days"
                    className="input"
                    type="number"
                    name="allowedTrialDays"
                    value={form.negotiationRules.allowedTrialDays}
                    onChange={handleNegoChange}
                    min={0}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="onb-annual-discount">Annual Discount %</label>
                  <input
                    id="onb-annual-discount"
                    className="input"
                    type="number"
                    name="annualContractDiscountPercent"
                    value={form.negotiationRules.annualContractDiscountPercent}
                    onChange={handleNegoChange}
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="onboarding__footer">
        <button
          id="onboarding-save"
          className="btn btn-primary"
          onClick={handleSave}
        >
          💾 Save Profile
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
