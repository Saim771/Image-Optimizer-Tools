"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, CreditCard, Wallet, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import { SignupModal } from "@/components/signup-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

export default function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic tools for occasional use",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        { name: "5 image compressions per day", included: true },
        { name: "3 PDF compressions per day", included: true },
        { name: "Basic image resizing", included: true },
        { name: "File size limit: 10MB", included: true },
        { name: "Ad-supported", included: true },
        { name: "Save history for 7 days", included: false },
        { name: "Priority processing", included: false },
        { name: "Bulk processing", included: false },
        { name: "API access", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Perfect for regular users and professionals",
      price: {
        monthly: 9.99,
        yearly: 7.99,
      },
      features: [
        { name: "Unlimited image compressions", included: true },
        { name: "Unlimited PDF compressions", included: true },
        { name: "Advanced image resizing", included: true },
        { name: "File size limit: 50MB", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Save history for 30 days", included: true },
        { name: "Priority processing", included: true },
        { name: "Bulk processing (up to 20 files)", included: true },
        { name: "API access", included: false },
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      description: "For teams and businesses with high volume needs",
      price: {
        monthly: 29.99,
        yearly: 24.99,
      },
      features: [
        { name: "Unlimited image compressions", included: true },
        { name: "Unlimited PDF compressions", included: true },
        { name: "Advanced image resizing", included: true },
        { name: "File size limit: 200MB", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Save history forever", included: true },
        { name: "Priority processing", included: true },
        { name: "Bulk processing (unlimited)", included: true },
        { name: "API access", included: true },
      ],
      cta: "Upgrade to Business",
      popular: false,
    },
  ]

  const handlePlanClick = (planId: string) => {
    if (planId === "free") {
      if (!user) {
        setIsSignupOpen(true)
      }
      return
    }

    if (!user) {
      setSelectedPlan(planId)
      setIsSignupOpen(true)
      return
    }

    setSelectedPlan(planId)
    setIsPaymentOpen(true)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsPaymentOpen(false)

    const plan = plans.find((p) => p.id === selectedPlan)

    toast({
      title: "Payment successful",
      description: `You have successfully upgraded to the ${plan?.name} plan.`,
    })
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-center mb-12">
        <div className="bg-muted/50 p-1 rounded-full inline-flex">
          <Button
            variant={billingCycle === "monthly" ? "default" : "ghost"}
            className={`rounded-full ${billingCycle === "monthly" ? "" : "hover:bg-transparent"}`}
            onClick={() => setBillingCycle("monthly")}
          >
            Monthly
          </Button>
          <Button
            variant={billingCycle === "yearly" ? "default" : "ghost"}
            className={`rounded-full ${billingCycle === "yearly" ? "" : "hover:bg-transparent"}`}
            onClick={() => setBillingCycle("yearly")}
          >
            Yearly <span className="ml-1 text-xs bg-primary/20 px-2 py-0.5 rounded-full">Save 20%</span>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative border-border/50 ${
              plan.popular ? "border-primary/50 shadow-lg shadow-primary/10" : "shadow-md"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className={`${plan.popular ? "pt-8" : "pt-6"}`}>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                {plan.price[billingCycle] > 0 && (
                  <span className="text-muted-foreground ml-2">
                    / {billingCycle === "monthly" ? "month" : "month, billed annually"}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>{feature.name}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handlePlanClick(plan.id)}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Need a custom plan?</h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          If you have specific requirements or need a tailored solution for your organization, we're here to help.
        </p>
        <Button size="lg" asChild>
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenSignup={() => {
          setIsLoginOpen(false)
          setIsSignupOpen(true)
        }}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onOpenLogin={() => {
          setIsSignupOpen(false)
          setIsLoginOpen(true)
        }}
      />

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete your purchase</DialogTitle>
            <DialogDescription>
              {selectedPlan && `You're upgrading to the ${plans.find((p) => p.id === selectedPlan)?.name} plan.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between mb-2">
                <span>Plan:</span>
                <span className="font-medium">{plans.find((p) => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Billing:</span>
                <span className="font-medium">{billingCycle === "monthly" ? "Monthly" : "Yearly"}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  ${plans.find((p) => p.id === selectedPlan)?.price[billingCycle]}/
                  {billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as "card" | "paypal")}
                className="flex flex-col space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-5 w-5" /> Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                    <Wallet className="h-5 w-5" /> PayPal
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Doe" />
                </div>
              </div>
            )}

            {paymentMethod === "paypal" && (
              <div className="text-center p-4">
                <p className="mb-4">You'll be redirected to PayPal to complete your purchase.</p>
                <img
                  src="/placeholder.svg?height=60&width=200&text=PayPal"
                  alt="PayPal"
                  className="mx-auto h-10 object-contain"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}

