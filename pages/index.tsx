import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  // Mobile nav, scroll effects (replaces main.js)
  useEffect(() => {
    const toggle = document.getElementById('nav-toggle') as HTMLButtonElement | null;
    const menu = document.getElementById('nav-menu') as HTMLElement | null;
    const header = document.getElementById('header') as HTMLElement | null;
    const backToTop = document.getElementById('back-to-top') as HTMLAnchorElement | null;

    const handleNavToggle = () => {
      if (!menu || !toggle) return;
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    const handleNavLinkClick = () => {
      if (!menu || !toggle) return;
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (!menu || !toggle) return;
      if (!menu.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    };

    const handleScroll = () => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 10);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    };

    if (toggle && menu) {
      toggle.addEventListener('click', handleNavToggle);
      menu.querySelectorAll('.nav__link').forEach((link) =>
        link.addEventListener('click', handleNavLinkClick)
      );
      document.addEventListener('click', handleOutsideClick);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (toggle) toggle.removeEventListener('click', handleNavToggle);
      document.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Hotel Yashoda – Budget Hotel &amp; Guest House in Bhadrak, Odisha</title>
        <meta
          name="description"
          content="Hotel Yashoda is a comfortable budget hotel and guest house in Bhadrak, Odisha. Offering AC & Non-AC rooms, in-house dining, free Wi-Fi, banquet facilities, and easy access to local attractions."
        />
        <meta
          name="keywords"
          content="Hotel Yashoda, Bhadrak hotel, budget hotel Odisha, guest house Bhadrak, AC rooms Bhadrak, hotel near Bhadrak, Odisha hotel"
        />
        <meta name="author" content="Hotel Yashoda" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://hotelyashoda.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hotelyashoda.vercel.app/" />
        <meta property="og:title" content="Hotel Yashoda – Budget Hotel & Guest House in Bhadrak, Odisha" />
        <meta
          property="og:description"
          content="Comfortable stay with AC & Non-AC rooms, in-house restaurant, free Wi-Fi, and banquet facilities in Bhadrak, Odisha."
        />
        <meta property="og:image" content="https://hotelyashoda.vercel.app/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hotel Yashoda – Budget Hotel & Guest House in Bhadrak, Odisha" />
        <meta
          name="twitter:description"
          content="Comfortable stay with AC & Non-AC rooms, in-house restaurant, free Wi-Fi, and banquet facilities in Bhadrak, Odisha."
        />
        <meta name="twitter:image" content="https://hotelyashoda.vercel.app/images/og-image.jpg" />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* ===== NAVIGATION ===== */}
      <header className="header" id="header">
        <nav className="nav container">
          <a href="#home" className="nav__logo">
            <span className="nav__logo-icon">🏨</span>
            Hotel Yashoda
          </a>

          <ul className="nav__menu" id="nav-menu">
            <li><a href="#home" className="nav__link">Home</a></li>
            <li><a href="#about" className="nav__link">About</a></li>
            <li><a href="#rooms" className="nav__link">Rooms</a></li>
            <li><a href="#restaurant" className="nav__link">Restaurant</a></li>
            <li><a href="#contact" className="nav__link">Contact</a></li>
            <li>
              <Link href="/rooms" className="nav__link">
                Book Online
              </Link>
            </li>
          </ul>

          <Link
            href="/rooms"
            className="btn btn--primary nav__cta"
          >
            Book Now
          </Link>

          <button className="nav__toggle" id="nav-toggle" aria-label="Toggle navigation">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>

      <main>
        {/* ===== HERO SECTION ===== */}
        <section className="hero" id="home">
          <div className="hero__overlay"></div>
          <div className="hero__content container">
            <span className="hero__badge">⭐ Bhadrak&apos;s Trusted Budget Hotel</span>
            <h1 className="hero__title">
              Welcome to<br />
              <span>Hotel Yashoda</span>
            </h1>
            <p className="hero__subtitle">
              Comfortable stays &amp; warm hospitality in the heart of Bhadrak, Odisha. AC &amp;
              Non-AC rooms, delicious dining, and every convenience at your fingertips.
            </p>
            <div className="hero__cta">
              <Link href="/rooms" className="btn btn--primary btn--lg">
                📅 Book Online
              </Link>
              <a
                href="https://wa.me/919437000000?text=Hello%2C%20I%20would%20like%20to%20book%20a%20room%20at%20Hotel%20Yashoda"
                className="btn btn--primary btn--lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                📱 WhatsApp
              </a>
              <a href="#contact" className="btn btn--outline btn--lg">
                📞 Contact Us
              </a>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>500+</strong>
                <span>Happy Guests</span>
              </div>
              <div className="hero__stat">
                <strong>AC &amp; Non-AC</strong>
                <span>Room Options</span>
              </div>
              <div className="hero__stat">
                <strong>24/7</strong>
                <span>Reception</span>
              </div>
            </div>
          </div>
          <a href="#about" className="hero__scroll" aria-label="Scroll down">
            <span>↓</span>
          </a>
        </section>

        {/* ===== ABOUT SECTION ===== */}
        <section className="about section" id="about">
          <div className="container">
            <div className="section__header">
              <span className="section__tag">About Us</span>
              <h2 className="section__title">Your Home Away from Home</h2>
              <p className="section__subtitle">
                Nestled in the heart of Bhadrak, Odisha, Hotel Yashoda has been welcoming guests
                with warm hospitality and affordable comfort.
              </p>
            </div>

            <div className="about__grid">
              <div className="about__image-wrap">
                <div className="about__image-placeholder">
                  <span>🏨</span>
                  <p>Hotel Yashoda Front View</p>
                </div>
              </div>

              <div className="about__content">
                <p className="about__text">
                  Hotel Yashoda is a well-established budget hotel and guest house located
                  conveniently in Bhadrak, Odisha. We pride ourselves on providing clean,
                  comfortable, and affordable accommodation for business travellers, pilgrims
                  visiting nearby temples, and leisure guests exploring the region.
                </p>
                <p className="about__text">
                  Our friendly and attentive staff ensure that every guest feels at home. Whether
                  you&apos;re here for a short business trip or a family holiday, we have everything
                  you need under one roof — from comfortable rooms to our in-house restaurant
                  serving authentic local cuisine.
                </p>

                <ul className="about__features">
                  <li className="about__feature">
                    <span className="about__feature-icon">✅</span>
                    <div>
                      <strong>Clean &amp; Comfortable Rooms</strong>
                      <p>Regularly maintained AC and Non-AC rooms with fresh linen.</p>
                    </div>
                  </li>
                  <li className="about__feature">
                    <span className="about__feature-icon">✅</span>
                    <div>
                      <strong>Strategic Location</strong>
                      <p>Easily accessible from Bhadrak Railway Station and city centre.</p>
                    </div>
                  </li>
                  <li className="about__feature">
                    <span className="about__feature-icon">✅</span>
                    <div>
                      <strong>Budget Friendly</strong>
                      <p>Affordable rates without compromising on quality or service.</p>
                    </div>
                  </li>
                  <li className="about__feature">
                    <span className="about__feature-icon">✅</span>
                    <div>
                      <strong>Dedicated Staff</strong>
                      <p>Courteous and helpful team available round the clock.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ===== ROOMS & FACILITIES ===== */}
        <section className="rooms section section--alt" id="rooms">
          <div className="container">
            <div className="section__header">
              <span className="section__tag">Rooms &amp; Facilities</span>
              <h2 className="section__title">Accommodation Options</h2>
              <p className="section__subtitle">
                Choose from a range of well-appointed rooms designed for your comfort and
                convenience.
              </p>
            </div>

            <div className="rooms__grid">
              {/* Standard Non-AC Room */}
              <div className="room-card">
                <div className="room-card__image room-card__image--1">
                  <span className="room-card__badge">Non-AC</span>
                  <div className="room-card__placeholder">🛏️</div>
                </div>
                <div className="room-card__body">
                  <h3>Standard Room (Non-AC)</h3>
                  <p>
                    Comfortable non-air-conditioned rooms ideal for budget-conscious travellers.
                    Clean beds, attached bathroom, and TV.
                  </p>
                  <ul className="room-card__amenities">
                    <li>🛏️ Double Bed</li>
                    <li>📺 Television</li>
                    <li>🚿 Attached Bath</li>
                    <li>📶 Free Wi-Fi</li>
                  </ul>
                  <Link href="/rooms" className="btn btn--primary btn--sm">
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Standard AC Room */}
              <div className="room-card room-card--featured">
                <div className="room-card__image room-card__image--2">
                  <span className="room-card__badge room-card__badge--gold">AC ★ Popular</span>
                  <div className="room-card__placeholder">🛏️</div>
                </div>
                <div className="room-card__body">
                  <h3>Standard Room (AC)</h3>
                  <p>
                    Air-conditioned rooms for a cooler, more relaxed stay during the hot Odisha
                    summers. Ideal for families and business guests.
                  </p>
                  <ul className="room-card__amenities">
                    <li>🛏️ Double Bed</li>
                    <li>❄️ Air Conditioning</li>
                    <li>📺 Television</li>
                    <li>🚿 Attached Bath</li>
                    <li>📶 Free Wi-Fi</li>
                  </ul>
                  <Link href="/rooms" className="btn btn--primary btn--sm">
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Family Room */}
              <div className="room-card">
                <div className="room-card__image room-card__image--3">
                  <span className="room-card__badge">Family Room</span>
                  <div className="room-card__placeholder">🛌</div>
                </div>
                <div className="room-card__body">
                  <h3>Family Room</h3>
                  <p>
                    Spacious family rooms accommodating 3–4 guests. Extra beds available on
                    request. Perfect for family visits to Bhadrak.
                  </p>
                  <ul className="room-card__amenities">
                    <li>🛌 Multiple Beds</li>
                    <li>❄️ Air Conditioning</li>
                    <li>📺 Television</li>
                    <li>🚿 Attached Bath</li>
                    <li>📶 Free Wi-Fi</li>
                  </ul>
                  <Link href="/rooms" className="btn btn--primary btn--sm">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="facilities">
              <h3 className="facilities__title">Hotel Facilities &amp; Amenities</h3>
              <div className="facilities__grid">
                <div className="facility-item">
                  <span className="facility-item__icon">📶</span>
                  <span>Free Wi-Fi</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🅿️</span>
                  <span>Parking</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🍽️</span>
                  <span>In-House Restaurant</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🎉</span>
                  <span>Banquet Hall</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🔒</span>
                  <span>24/7 Security</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🧹</span>
                  <span>Daily Housekeeping</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">🏧</span>
                  <span>ATM Nearby</span>
                </div>
                <div className="facility-item">
                  <span className="facility-item__icon">📞</span>
                  <span>24/7 Reception</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== RESTAURANT SECTION ===== */}
        <section className="restaurant section" id="restaurant">
          <div className="container">
            <div className="section__header">
              <span className="section__tag">Dining</span>
              <h2 className="section__title">In-House Restaurant</h2>
              <p className="section__subtitle">
                Savour authentic Odia flavours and classic Indian dishes right at our on-site
                restaurant – open for breakfast, lunch, and dinner.
              </p>
            </div>

            <div className="restaurant__grid">
              <div className="restaurant__info">
                <div className="restaurant__image-placeholder">
                  🍛
                  <p>Our Restaurant</p>
                </div>
                <div className="restaurant__details">
                  <h3>Yashoda Diner</h3>
                  <p>
                    Our in-house restaurant offers a warm, homely dining experience with a menu
                    that celebrates the rich flavours of Odisha alongside popular North and South
                    Indian dishes. Fresh ingredients, home-style cooking, and generous portions
                    make every meal memorable.
                  </p>
                  <div className="restaurant__timings">
                    <div className="timing">
                      <span className="timing__meal">🌅 Breakfast</span>
                      <span className="timing__time">7:00 AM – 10:30 AM</span>
                    </div>
                    <div className="timing">
                      <span className="timing__meal">☀️ Lunch</span>
                      <span className="timing__time">12:00 PM – 3:30 PM</span>
                    </div>
                    <div className="timing">
                      <span className="timing__meal">🌙 Dinner</span>
                      <span className="timing__time">7:00 PM – 10:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="menu">
                <h3 className="menu__title">Sample Menu</h3>
                <div className="menu__categories">
                  <div className="menu__category">
                    <h4>🍚 Rice &amp; Thali</h4>
                    <ul>
                      <li>
                        <span>Odia Thali (Full Plate)</span>
                        <span>₹120</span>
                      </li>
                      <li>
                        <span>Steamed Rice + Dal + Sabji</span>
                        <span>₹80</span>
                      </li>
                      <li>
                        <span>Veg Biryani</span>
                        <span>₹100</span>
                      </li>
                      <li>
                        <span>Chicken Biryani</span>
                        <span>₹160</span>
                      </li>
                    </ul>
                  </div>
                  <div className="menu__category">
                    <h4>🍞 Breads &amp; Snacks</h4>
                    <ul>
                      <li>
                        <span>Roti / Paratha</span>
                        <span>₹15 each</span>
                      </li>
                      <li>
                        <span>Puri Sabji</span>
                        <span>₹60</span>
                      </li>
                      <li>
                        <span>Samosa (2 pcs)</span>
                        <span>₹30</span>
                      </li>
                      <li>
                        <span>Pakoda Plate</span>
                        <span>₹50</span>
                      </li>
                    </ul>
                  </div>
                  <div className="menu__category">
                    <h4>🍗 Non-Vegetarian</h4>
                    <ul>
                      <li>
                        <span>Chicken Curry (half)</span>
                        <span>₹180</span>
                      </li>
                      <li>
                        <span>Mutton Curry (half)</span>
                        <span>₹220</span>
                      </li>
                      <li>
                        <span>Fish Curry (Odia style)</span>
                        <span>₹150</span>
                      </li>
                      <li>
                        <span>Egg Curry</span>
                        <span>₹80</span>
                      </li>
                    </ul>
                  </div>
                  <div className="menu__category">
                    <h4>☕ Beverages</h4>
                    <ul>
                      <li>
                        <span>Chai / Tea</span>
                        <span>₹15</span>
                      </li>
                      <li>
                        <span>Coffee</span>
                        <span>₹25</span>
                      </li>
                      <li>
                        <span>Lassi (Sweet/Salt)</span>
                        <span>₹40</span>
                      </li>
                      <li>
                        <span>Cold Drinks</span>
                        <span>₹30</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="menu__note">
                  * Prices are indicative and subject to change. Please ask staff for current menu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="testimonials section section--alt" id="testimonials">
          <div className="container">
            <div className="section__header">
              <span className="section__tag">Guest Reviews</span>
              <h2 className="section__title">What Our Guests Say</h2>
              <p className="section__subtitle">
                Real experiences from travellers who stayed with us at Hotel Yashoda, Bhadrak.
              </p>
            </div>

            <div className="testimonials__grid">
              <div className="testimonial-card">
                <div className="testimonial-card__stars">★★★★★</div>
                <p className="testimonial-card__text">
                  &quot;Excellent stay! The room was clean and well-maintained. Staff was very helpful
                  and friendly. The food at the restaurant is absolutely delicious – the Odia Thali
                  is a must-try! Will definitely come back.&quot;
                </p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">R</div>
                  <div>
                    <strong>Ramesh Pattnaik</strong>
                    <span>Cuttack, Odisha · Google Review</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card testimonial-card--featured">
                <div className="testimonial-card__stars">★★★★★</div>
                <p className="testimonial-card__text">
                  &quot;Best budget hotel in Bhadrak! Great value for money. AC room was nice and cool.
                  Location is very convenient – close to the railway station. Highly recommended for
                  anyone visiting Bhadrak.&quot;
                </p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">S</div>
                  <div>
                    <strong>Sunita Sahoo</strong>
                    <span>Bhubaneswar · Google Review</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-card__stars">★★★★☆</div>
                <p className="testimonial-card__text">
                  &quot;Good hotel with decent facilities. Room was comfortable and clean. The breakfast
                  was tasty. Staff was courteous and checked in quickly. Parking was available too.
                  Nice experience overall.&quot;
                </p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">A</div>
                  <div>
                    <strong>Anil Kumar Das</strong>
                    <span>Kolkata · MakeMyTrip Review</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rating-summary">
              <div className="rating-summary__score">
                <span className="rating-summary__number">4.5</span>
                <div className="rating-summary__stars">★★★★½</div>
                <span className="rating-summary__label">Overall Rating</span>
              </div>
              <div className="rating-summary__bars">
                <div className="rating-bar">
                  <span>Cleanliness</span>
                  <div className="rating-bar__track">
                    <div className="rating-bar__fill" style={{ width: '90%' }}></div>
                  </div>
                  <span>4.5</span>
                </div>
                <div className="rating-bar">
                  <span>Value</span>
                  <div className="rating-bar__track">
                    <div className="rating-bar__fill" style={{ width: '92%' }}></div>
                  </div>
                  <span>4.6</span>
                </div>
                <div className="rating-bar">
                  <span>Staff</span>
                  <div className="rating-bar__track">
                    <div className="rating-bar__fill" style={{ width: '88%' }}></div>
                  </div>
                  <span>4.4</span>
                </div>
                <div className="rating-bar">
                  <span>Location</span>
                  <div className="rating-bar__track">
                    <div className="rating-bar__fill" style={{ width: '86%' }}></div>
                  </div>
                  <span>4.3</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CONTACT SECTION ===== */}
        <section className="contact section" id="contact">
          <div className="container">
            <div className="section__header">
              <span className="section__tag">Get In Touch</span>
              <h2 className="section__title">Contact &amp; Location</h2>
              <p className="section__subtitle">
                Reach us by phone, WhatsApp, or visit us directly in Bhadrak, Odisha.
              </p>
            </div>

            <div className="contact__grid">
              <div className="contact__info">
                <div className="contact-item">
                  <div className="contact-item__icon">📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>
                      Hotel Yashoda,
                      <br />
                      Bhadrak, Odisha – 756100
                      <br />
                      India
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item__icon">📞</div>
                  <div>
                    <h4>Phone</h4>
                    <p>
                      <a href="tel:+919437000000">+91 94370 00000</a>
                    </p>
                    <p>
                      <a href="tel:+916758000000">+91 67580 00000</a>
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item__icon">💬</div>
                  <div>
                    <h4>WhatsApp</h4>
                    <a
                      href="https://wa.me/919437000000?text=Hello%2C%20I%20would%20like%20to%20enquire%20about%20Hotel%20Yashoda"
                      className="btn btn--whatsapp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item__icon">⏰</div>
                  <div>
                    <h4>Reception Hours</h4>
                    <p>Open 24 Hours, 7 Days a Week</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-item__icon">✉️</div>
                  <div>
                    <h4>Email</h4>
                    <p>
                      <a href="mailto:info@hotelyashoda.com">info@hotelyashoda.com</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact__map">
                <div className="map-container">
                  <iframe
                    title="Hotel Yashoda Location – Bhadrak, Odisha"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59898.84327268!2d86.47155!3d21.05798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1b4c0000000001%3A0x0!2sBhadrak%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <a
                  href="https://maps.google.com/?q=Bhadrak,+Odisha,+India"
                  className="btn btn--outline map-directions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🗺️ Get Directions
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <a href="#home" className="footer__logo">
                🏨 Hotel Yashoda
              </a>
              <p>
                Your trusted budget hotel and guest house in Bhadrak, Odisha. Comfortable rooms,
                warm hospitality, and authentic dining — always at affordable prices.
              </p>
              <div className="footer__social">
                <a
                  href="https://facebook.com/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/"
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer__links">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#rooms">Rooms &amp; Facilities</a></li>
                <li><a href="#restaurant">Restaurant</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><Link href="/rooms">Book Online</Link></li>
              </ul>
            </div>

            <div className="footer__links">
              <h4>Rooms</h4>
              <ul>
                <li><a href="#rooms">Standard Room (Non-AC)</a></li>
                <li><a href="#rooms">Standard Room (AC)</a></li>
                <li><a href="#rooms">Family Room</a></li>
                <li><a href="#rooms">Banquet Hall</a></li>
              </ul>
            </div>

            <div className="footer__contact">
              <h4>Contact</h4>
              <p>📍 Bhadrak, Odisha – 756100</p>
              <p>
                📞 <a href="tel:+919437000000">+91 94370 00000</a>
              </p>
              <p>
                ✉️ <a href="mailto:info@hotelyashoda.com">info@hotelyashoda.com</a>
              </p>
              <p>⏰ 24/7 Reception</p>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2025 Hotel Yashoda, Bhadrak, Odisha. All rights reserved.</p>
            <p>Designed with ❤️ for our valued guests.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <a href="#home" className="back-to-top" id="back-to-top" aria-label="Back to top">
        ↑
      </a>
    </>
  );
}
